/**
 * ============================================================================
 * Arduino UNO R4 + LoRa Shield (SX1276 / RFM95) Firmware
 * ============================================================================
 * เชื่อมต่อ LoRaWAN Network Server (ChirpStack: https://lora.kmitl.ac.th/)
 *
 * การกำหนดขา Pin (Pin Mapping):
 *   1. LoRa Shield (SX1276/RFM95):
 *      - NSS (CS) : Pin D10
 *      - DIO0     : Pin D2
 *      - RST      : Pin D9
 *      - DIO1     : Pin D6
 *      - SPI Bus  : Pin D11 (MOSI), D12 (MISO), D13 (SCK)
 *
 *   2. เซนเซอร์วัดแสง LM393 LDR Module (แบบ 4 ขา: AO, DO, GND, VCC):
 *      - ขา AO (Analog Output)  : ต่อเข้า Pin A0 (อ่านค่าความสว่างละเอียด 0 - 1023 / 0 - 100%)
 *      - ขา DO (Digital Output) : ต่อเข้า Pin D5 (อ่านสถานะสว่าง/มืดตามเกณฑ์ Trimpot: LOW = แสงจ้าเกินเกณฑ์, HIGH = มืด)
 *      - ขา GND                 : ต่อเข้า Pin GND
 *      - ขา VCC                 : ต่อเข้า Pin 5V
 *      * บนโมดูลมีตัวต้านทานปรับค่าได้ (Trimpot สีฟ้า) สำหรับหมุนตั้งเกณฑ์ความไวของขา DO
 *
 *   3. เซนเซอร์ Infrared ตรวจจับวัตถุ (IR Obstacle - Digital):
 *      - ขา DO (OUT)            : ต่อเข้า Pin D3 (LOW = ตรวจพบวัตถุ, HIGH = ปกติ)
 *      - ขา VCC / GND           : 5V / GND
 *
 *   4. ไฟ LED สำหรับรับคำสั่งเปิด/ปิดผ่าน AI Chat box (LoRa Downlink):
 *      - Anode (+)              : ต่อเข้า Pin D4 (ผ่านตัวต้านทาน 220Ω ลง GND)
 *      * หมายเหตุ: ไม่ใช้ D13 (LED_BUILTIN) เพราะ D13 ถูกใช้เป็นสัญญาณ SCK ของ SPI LoRa Shield
 *
 * ไลบรารีที่ต้องติดตั้งใน Arduino IDE:
 *   - ค้นหาและติดตั้ง "RadioLib" (โดย Jan Gromes) ใน Library Manager
 * ============================================================================
 */

#include <RadioLib.h>

// ----------------------------------------------------------------------------
// 1. กำหนดขา Pin สำหรับ LoRa Shield และเซนเซอร์บน Arduino UNO R4
// ----------------------------------------------------------------------------
#define LORA_NSS_PIN   10
#define LORA_DIO0_PIN  2
#define LORA_RST_PIN   9
#define LORA_DIO1_PIN  6

// ขาสำหรับโมดูลวัดแสง 4 ขา (LDR LM393 Module)
#define PIN_LIGHT_AO   A0   // ขา AO: อ่านระดับความเข้มแสงแบบ Analog (0 - 1023)
#define PIN_LIGHT_DO   5    // ขา DO: อ่านสถานะมืด/สว่างตามเกณฑ์ Trimpot (Digital Input D5)

// ขาสำหรับเซนเซอร์ Infrared และ LED
#define PIN_IR_SENSOR  3    // เซนเซอร์ Infrared ตรวจจับวัตถุ (Digital Input D3)
#define PIN_NODE_LED   4    // ไฟ LED สำหรับสั่งเปิด/ปิดจาก AI Chat box (Digital Output D4)

// สร้างออบเจกต์ชิป SX1276 (RFM95)
SX1276 radio = new Module(LORA_NSS_PIN, LORA_DIO0_PIN, LORA_RST_PIN, LORA_DIO1_PIN);

// ตั้งค่าความถี่ LoRaWAN โซนประเทศไทย AS923 (ChirpStack: lora.kmitl.ac.th)
LoRaWANNode node(&radio, &AS923);

// ----------------------------------------------------------------------------
// 2. ตั้งค่ากุญแจ OTAA จากเว็บ ChirpStack (https://lora.kmitl.ac.th/)
//    *** นำค่า DevEUI, JoinEUI (AppEUI), และ AppKey จากหน้าเว็บมาใส่ตรงนี้ ***
// ----------------------------------------------------------------------------
uint64_t joinEUI = 0x0000000000000000ULL; // JoinEUI / AppEUI (64-bit Hex)
uint64_t devEUI  = 0x0000000000000000ULL; // Device EUI จาก lora.kmitl.ac.th
uint8_t appKey[] = {
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
uint8_t nwkKey[] = {
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};

bool ledState = false;
unsigned long lastUplinkMs = 0;
const unsigned long UPLINK_INTERVAL_MS = 15000; // ส่งข้อมูลทุกๆ 15 วินาที

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000) {}

  // ตั้งค่าโหมดขา Pin
  pinMode(PIN_LIGHT_AO, INPUT);
  pinMode(PIN_LIGHT_DO, INPUT);
  pinMode(PIN_IR_SENSOR, INPUT_PULLUP);
  pinMode(PIN_NODE_LED, OUTPUT);
  digitalWrite(PIN_NODE_LED, LOW);

  Serial.println(F("===================================================="));
  Serial.println(F(" Arduino UNO R4 + LoRa Shield (SX1276/RFM95) Start"));
  Serial.println(F(" LDR Module 4-Pin: AO=A0, DO=D5, GND, VCC=5V"));
  Serial.println(F(" Infrared: D3 | Node LED: D4"));
  Serial.println(F("===================================================="));

  Serial.print(F("[SX1276] Initializing radio... "));
  int state = radio.begin();
  if (state != RADIOLIB_ERR_NONE) {
    Serial.print(F("Failed, code: "));
    Serial.println(state);
    while (true) { delay(1000); }
  }
  Serial.println(F("OK!"));

  // เริ่มต้นการ Join เข้า ChirpStack (OTAA)
  Serial.print(F("[LoRaWAN] Joining ChirpStack (lora.kmitl.ac.th)... "));
  node.beginOTAA(joinEUI, devEUI, nwkKey, appKey);
  state = node.activateOTAA();
  if (state != RADIOLIB_LORAWAN_NEW_SESSION && state != RADIOLIB_ERR_NONE) {
    Serial.print(F("Join failed, code: "));
    Serial.println(state);
    Serial.println(F("กรุณาตรวจสอบค่า devEUI / appKey และการเชื่อมต่อสายอากาศ"));
  } else {
    Serial.println(F("Joined successfully!"));
  }
}

void sendSensorUplinkAndCheckDownlink() {
  // 1. อ่านค่าเซนเซอร์วัดแสงจากโมดูล 4 ขา
  //    - ขา AO (Analog): 0 - 1023
  uint16_t lightRaw = (uint16_t)analogRead(PIN_LIGHT_AO);
  //    - ขา DO (Digital): โมดูล LM393 ส่วนใหญ่จ่าย LOW เมื่อแสงสว่างเกินเกณฑ์ Trimpot (สว่างจ้า), HIGH เมื่อมืด
  bool lightThresholdExceeded = (digitalRead(PIN_LIGHT_DO) == LOW);

  // 2. อ่านค่าเซนเซอร์ Infrared ตรวจจับวัตถุ (ขา D3: จ่าย LOW เมื่อตรวจพบวัตถุ)
  bool obstacleDetected = (digitalRead(PIN_IR_SENSOR) == LOW);

  // 3. จัดแพ็กเกจข้อมูล 5 Bytes สำหรับส่งขึ้น LoRaWAN
  //    Byte 0: Light Raw MSB (Analog AO)
  //    Byte 1: Light Raw LSB (Analog AO)
  //    Byte 2: Infrared (1 = Detected, 0 = Clear)
  //    Byte 3: LED State on D4 (1 = ON, 0 = OFF)
  //    Byte 4: Light DO Digital (1 = สว่างเกินเกณฑ์ Trimpot, 0 = มืด/ต่ำกว่าเกณฑ์)
  uint8_t uplinkPayload[5];
  uplinkPayload[0] = (uint8_t)((lightRaw >> 8) & 0xFF);
  uplinkPayload[1] = (uint8_t)(lightRaw & 0xFF);
  uplinkPayload[2] = obstacleDetected ? 0x01 : 0x00;
  uplinkPayload[3] = ledState ? 0x01 : 0x00;
  uplinkPayload[4] = lightThresholdExceeded ? 0x01 : 0x00;

  Serial.print(F("[Sensors] Light AO(A0)="));
  Serial.print(lightRaw);
  Serial.print(F(" | Light DO(D5)="));
  Serial.print(lightThresholdExceeded ? F("BRIGHT") : F("DARK"));
  Serial.print(F(" | Infrared(D3)="));
  Serial.print(obstacleDetected ? F("DETECTED") : F("CLEAR"));
  Serial.print(F(" | LED(D4)="));
  Serial.println(ledState ? F("ON") : F("OFF"));

  // เตรียมบัฟเฟอร์รับข้อมูล Downlink จาก ChirpStack (เมื่อสั่งผ่าน AI Chat box หรือ Web Dashboard)
  uint8_t downlinkPayload[16];
  size_t downlinkLen = sizeof(downlinkPayload);

  int state = node.sendReceive(uplinkPayload, sizeof(uplinkPayload), 1, downlinkPayload, &downlinkLen);

  if (state == RADIOLIB_ERR_NONE || state > 0) {
    Serial.println(F("[LoRaWAN] Uplink transmitted successfully."));
    if (downlinkLen > 0) {
      Serial.print(F("[LoRaWAN] Received Downlink (len="));
      Serial.print(downlinkLen);
      Serial.print(F("): 0x"));
      Serial.println(downlinkPayload[0], HEX);

      // ถ้ารับค่า 0x01 ให้เปิดไฟ LED ขา D4, ถ้ารับค่า 0x00 ให้ปิดไฟ LED ขา D4
      if (downlinkPayload[0] == 0x01) {
        ledState = true;
        digitalWrite(PIN_NODE_LED, HIGH);
        Serial.println(F("[Control] LoRa Node LED (D4) -> ON"));
      } else if (downlinkPayload[0] == 0x00) {
        ledState = false;
        digitalWrite(PIN_NODE_LED, LOW);
        Serial.println(F("[Control] LoRa Node LED (D4) -> OFF"));
      }
    }
  } else {
    Serial.print(F("[LoRaWAN] Transmission error code: "));
    Serial.println(state);
  }
}

void loop() {
  unsigned long now = millis();
  if (now - lastUplinkMs >= UPLINK_INTERVAL_MS || lastUplinkMs == 0) {
    lastUplinkMs = now;
    sendSensorUplinkAndCheckDownlink();
  }
}
