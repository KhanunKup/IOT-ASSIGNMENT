/**
 * ============================================================================
 * Arduino UNO R4 + LoRa Shield (SX1276 / RFM95) Firmware
 * ============================================================================
 * เชื่อมต่อ LoRaWAN Network Server (ChirpStack: https://lora.kmitl.ac.th/)
 * Application: 67070044 (ID: 91665bbd-da0f-486e-908a-a45de5148670)
 * Device: LoRaWan (Profile: Cytron - LoRaWAN 1.0.x)
 *
 * การกำหนดขา Pin (Pin Mapping):
 *   1. LoRa Shield (SX1276/RFM95):
 *      - NSS (CS) : Pin D10
 *      - DIO0     : Pin D2
 *      - RST      : Pin D9
 *      - DIO1     : Pin D6 (*** สำคัญ: ต้องเสียบ Jumper บริดจ์ขา DIO1 กับ D6 บน Shield ***)
 *      - SPI Bus  : Pin D11 (MOSI), D12 (MISO), D13 (SCK)
 *
 *   2. โมดูลวัดแสง LM393 LDR (แบบ 4 ขา: AO, DO, GND, VCC):
 *      - ขา AO (Analog Output)  : ต่อเข้า Pin A0 (0 - 1023 โดยค่าต่ำ = สว่างมาก, ค่าสูง = มืด)
 *      - ขา DO (Digital Output) : ต่อเข้า Pin D5 (LOW = สว่างเกินเกณฑ์ Trimpot, HIGH = มืด)
 *      - ขา GND                 : ต่อเข้า Pin GND
 *      - ขา VCC                 : ต่อเข้า Pin 5V
 *
 *   3. ไฟ LED สำหรับรับคำสั่งเปิด/ปิดผ่าน AI Chat box (LoRa Downlink):
 *      - Anode (+)              : ต่อเข้า Pin D4 (ผ่านตัวต้านทาน 220Ω ลง GND)
 * ============================================================================
 */

#include <RadioLib.h>

// ----------------------------------------------------------------------------
// 1. กำหนดขา Pin สำหรับ LoRa Shield และอุปกรณ์บน Arduino UNO R4
// ----------------------------------------------------------------------------
#define LORA_NSS_PIN   10
#define LORA_DIO0_PIN  2
#define LORA_RST_PIN   9
#define LORA_DIO1_PIN  6  // Dragino Shield: ต้องมี Jumper เสียบระหว่าง DIO1 กับ D6

#define PIN_LIGHT_AO   A0 // ขา AO: อ่านระดับแสง Analog
#define PIN_LIGHT_DO   5  // ขา DO: อ่านสถานะมืด/สว่างตามเกณฑ์ Trimpot (Digital Input D5)
#define PIN_NODE_LED   4  // ไฟ LED รับคำสั่ง Downlink (Digital Output D4)

// สร้างออบเจกต์ชิป SX1276 (RFM95)
SX1276 radio = new Module(LORA_NSS_PIN, LORA_DIO0_PIN, LORA_RST_PIN, LORA_DIO1_PIN);

// ตั้งค่าความถี่ LoRaWAN โซนประเทศไทย AS923 (ChirpStack: lora.kmitl.ac.th)
LoRaWANNode node(&radio, &AS923);

// ----------------------------------------------------------------------------
// 2. ตั้งค่ากุญแจ OTAA จากเว็บ ChirpStack (Application: 67070044 / Device: LoRaWan)
// ----------------------------------------------------------------------------
// Join EUI / AppEUI (64-bit Hex): 0c8badd9567b322f
uint64_t joinEUI = 0x0C8BADD9567B322FULL;

// Device EUI: d1b2824606880dcd
// หมายเหตุ: RadioLib ใช้ลำดับ MSB ตามที่แสดงในตาราง ChirpStack
uint64_t devEUI  = 0xD1B2824606880DCDULL;
// หาก Join ไม่ผ่าน ให้สลับเป็นแบบ LSB: uint64_t devEUI = 0xCD0D88064682B2D1ULL;

// Application Key: 7d3488d5f6b4d4159ac69658df468716
uint8_t appKey[] = {
  0x7D, 0x34, 0x88, 0xD5, 0xF6, 0xB4, 0xD4, 0x15,
  0x9A, 0xC6, 0x96, 0x58, 0xDF, 0x46, 0x87, 0x16
};

bool isJoined = false;
bool ledState = false;
unsigned long lastActionMs = 0;
const unsigned long UPLINK_INTERVAL_MS = 15000; // ส่ง Uplink ทุกๆ 15 วินาที
const unsigned long JOIN_RETRY_INTERVAL_MS = 10000; // พยายาม Join ใหม่ทุกๆ 10 วินาทีหากยังไม่ติด

void attemptJoin() {
  Serial.println(F("----------------------------------------------------"));
  Serial.print(F("[LoRaWAN] Sending Join-Request to ChirpStack (AS923)... "));
  
  // LoRaWAN 1.0.x (Device Profile Cytron): ต้องส่ง NULL ในพารามิเตอร์ nwkKey
  node.beginOTAA(joinEUI, devEUI, NULL, appKey);

  int state = node.activateOTAA();
  if (state == RADIOLIB_LORAWAN_NEW_SESSION || state == RADIOLIB_ERR_NONE) {
    isJoined = true;
    Serial.println(F("\n>>> [LoRaWAN] JOINED SUCCESSFULLY! เข้าสู่เครือข่ายสำเร็จ <<<"));
  } else {
    isJoined = false;
    Serial.print(F("FAILED, Error Code: "));
    Serial.println(state);

    if (state == -1109 || state == -706 || state == -6) {
      Serial.println(F(">> คำแนะนำการแก้ปัญหา:"));
      Serial.println(F("   1. ตรวจสอบว่าบอร์ด LoRa Shield เสียบ Jumper เชื่อมระหว่างขา DIO1 กับ D6 หรือไม่"));
      Serial.println(F("   2. ตรวจสอบว่าเสาอากาศ LoRa ขันแน่นดีหรือไม่"));
      Serial.println(F("   3. ใน ChirpStack: ตรวจสอบหน้า Live Device Data ว่ามี JoinRequest วิ่งเข้ามาหรือไม่"));
      Serial.println(F("   4. หาก ChirpStack ไม่เห็น ให้ลองสลับ devEUI เป็น 0xCD0D88064682B2D1ULL"));
    }
  }
  Serial.println(F("----------------------------------------------------"));
}

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000) {}

  pinMode(PIN_LIGHT_AO, INPUT);
  pinMode(PIN_LIGHT_DO, INPUT);
  pinMode(PIN_NODE_LED, OUTPUT);
  digitalWrite(PIN_NODE_LED, LOW);

  Serial.println(F("===================================================="));
  Serial.println(F(" Arduino UNO R4 + LoRa Shield (SX1276/RFM95) Start"));
  Serial.println(F(" ChirpStack: lora.kmitl.ac.th | DevEUI: d1b2824606880dcd"));
  Serial.println(F(" Pins: LDR AO=A0, DO=D5 | Node LED=D4"));
  Serial.println(F("===================================================="));

  Serial.print(F("[SX1276] Initializing SPI & radio... "));
  int state = radio.begin();
  if (state != RADIOLIB_ERR_NONE) {
    Serial.print(F("Failed, code: "));
    Serial.println(state);
    Serial.println(F("ตรวจไม่พบชิป SX1276 กรุณาตรวจสอบการเสียบ Shield บน Arduino"));
    while (true) { delay(1000); }
  }
  Serial.println(F("OK!"));

  // พยายาม Join ครั้งแรก
  attemptJoin();
}

void sendSensorUplinkAndCheckDownlink() {
  // 1. อ่านค่าเซนเซอร์วัดแสง LM393 LDR จากขา A0 และ D5
  uint16_t lightRaw = (uint16_t)analogRead(PIN_LIGHT_AO);

  // บนโมดูล LM393 LDR ส่วนใหญ่: ยิ่งสว่าง ค่า ADC ยิ่งน้อย (~30), ยิ่งมืด ค่า ADC ยิ่งมาก (~900)
  // คำนวณเป็น % ความสว่าง: ยิ่งสว่าง ยิ่งใกล้ 100%
  float brightnessPercent = ((1023.0 - (float)lightRaw) / 1023.0) * 100.0;
  if (brightnessPercent < 0.0) brightnessPercent = 0.0;
  if (brightnessPercent > 100.0) brightnessPercent = 100.0;

  // ขา DO: เมื่อแสงสว่างเกินเกณฑ์ Trimpot โมดูลจะจ่าย LOW (0) และไฟ LED DO บนโมดูลจะติด
  bool lightThresholdExceeded = (digitalRead(PIN_LIGHT_DO) == LOW);

  // 2. จัดแพ็กเกจข้อมูล 4 Bytes สำหรับส่งขึ้น LoRaWAN
  //    Byte 0: Light Raw MSB (Analog AO)
  //    Byte 1: Light Raw LSB (Analog AO)
  //    Byte 2: Light DO Digital (1 = สว่างเกินเกณฑ์ Trimpot, 0 = มืด)
  //    Byte 3: LED State on D4 (1 = ON, 0 = OFF)
  uint8_t uplinkPayload[4];
  uplinkPayload[0] = (uint8_t)((lightRaw >> 8) & 0xFF);
  uplinkPayload[1] = (uint8_t)(lightRaw & 0xFF);
  uplinkPayload[2] = lightThresholdExceeded ? 0x01 : 0x00;
  uplinkPayload[3] = ledState ? 0x01 : 0x00;

  Serial.print(F("[Sensors] Light Raw(A0)="));
  Serial.print(lightRaw);
  Serial.print(F(" (ความสว่าง: "));
  Serial.print(brightnessPercent, 1);
  Serial.print(F("%) | DO(D5)="));
  Serial.print(lightThresholdExceeded ? F("BRIGHT (สว่างเกินเกณฑ์)") : F("DARK (มืด)"));
  Serial.print(F(" | LED(D4)="));
  Serial.println(ledState ? F("ON") : F("OFF"));

  // เตรียมบัฟเฟอร์รับข้อมูล Downlink จาก ChirpStack (เมื่อสั่งผ่าน AI Chat box หรือ Web Dashboard)
  uint8_t downlinkPayload[16];
  size_t downlinkLen = sizeof(downlinkPayload);

  int state = node.sendReceive(uplinkPayload, sizeof(uplinkPayload), 1, downlinkPayload, &downlinkLen);

  if (state == RADIOLIB_ERR_NONE || state > 0) {
    Serial.println(F("[LoRaWAN] >>> Uplink transmitted & confirmed successfully <<<"));
    if (downlinkLen > 0) {
      Serial.print(F("[LoRaWAN] Received Downlink (len="));
      Serial.print(downlinkLen);
      Serial.print(F("): 0x"));
      Serial.println(downlinkPayload[0], HEX);

      if (downlinkPayload[0] == 0x01) {
        ledState = true;
        digitalWrite(PIN_NODE_LED, HIGH);
        Serial.println(F("[Control] LoRa Node LED (D4) -> ON (เปิดไฟ)"));
      } else if (downlinkPayload[0] == 0x00) {
        ledState = false;
        digitalWrite(PIN_NODE_LED, LOW);
        Serial.println(F("[Control] LoRa Node LED (D4) -> OFF (ปิดไฟ)"));
      }
    }
  } else {
    Serial.print(F("[LoRaWAN] Transmission failed, code: "));
    Serial.println(state);
    if (state == RADIOLIB_ERR_NETWORK_NOT_JOINED) {
      Serial.println(F("หลุดการเชื่อมต่อจาก LoRaWAN จะทำการ Join ใหม่อัตโนมัติ..."));
      isJoined = false;
    }
  }
}

void loop() {
  unsigned long now = millis();

  if (!isJoined) {
    // หากยัง Join ไม่สำเร็จ ให้พยายาม Join ทุกๆ 10 วินาที
    if (now - lastActionMs >= JOIN_RETRY_INTERVAL_MS || lastActionMs == 0) {
      lastActionMs = now;
      attemptJoin();
    }
  } else {
    // เมื่อ Join สำเร็จแล้ว ส่งข้อมูลเซนเซอร์ตามรอบเวลา
    if (now - lastActionMs >= UPLINK_INTERVAL_MS) {
      lastActionMs = now;
      sendSensorUplinkAndCheckDownlink();
    }
  }
}
