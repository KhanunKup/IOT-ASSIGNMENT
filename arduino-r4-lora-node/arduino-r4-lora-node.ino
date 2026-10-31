/*******************************************************************************
 * Arduino UNO R4 + LoRa Shield Firmware (LMIC OTAA)
 * เชื่อมต่อ LoRaWAN Network Server (ChirpStack: https://lora.kmitl.ac.th/)
 * 
 * Application: 67070044 (ID: 91665bbd-da0f-486e-908a-a45de5148670)
 * Device: LoRaWan (Device Profile: Cytron)
 *
 * การกำหนดขา Pin (Pin Mapping ตามบอร์ด Shield ในแล็บ):
 *   - LoRa Shield: NSS=10, RST=7, DIO0=2, DIO1=5, DIO2=6, SPI=D11-D13
 *   - ไฟ LED รับคำสั่ง Downlink: Pin D4
 *   - โมดูลวัดแสง LDR (4 ขา): ขา AO -> Pin A0, ขา DO -> Pin D3
 *     (หมายเหตุ: ย้ายขา DO จาก D5 ไป D3 เพราะ D5 ถูกจองเป็นขา DIO1 ของ LoRa Shield)
 *******************************************************************************/

#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>

// ----------------------------------------------------------------------------
// 1. ตั้งค่าโหมดการทำงาน
// ----------------------------------------------------------------------------
// ตั้งเป็น true: ส่งข้อความทดสอบ "HELLO" เพื่อยืนยันว่าเชื่อมต่อ ChirpStack ได้สำเร็จ 100%
// ตั้งเป็น false: สลับไปอ่านค่าเซนเซอร์วัดแสง LDR (A0, D3) ส่งขึ้นระบบ
const bool TEST_MODE_ONLY = true;

// ช่วงเวลาส่งข้อมูล (วินาที)
const unsigned TX_INTERVAL = 15;

// ขาสำหรับอุปกรณ์เสริม
#define PIN_NODE_LED   4   // ไฟ LED สำหรับทดสอบรับคำสั่ง Downlink
#define PIN_LIGHT_AO   A0  // เซนเซอร์วัดแสง LDR ขา AO (Analog 0 - 1023)
#define PIN_LIGHT_DO   3   // เซนเซอร์วัดแสง LDR ขา DO (Digital Input D3)

bool ledState = false;

// ----------------------------------------------------------------------------
// 2. กุญแจ OTAA จาก ChirpStack (Little-endian สำหรับ APPEUI & DEVEUI)
// ----------------------------------------------------------------------------
// APPEUI / JoinEUI: ใน ChirpStack คือ 0c8badd9567b322f
// LMIC ต้องใช้แบบ Little-endian (LSB first) จึงต้องกลับด้านไบต์:
static const u1_t PROGMEM APPEUI[8] = { 0x2F, 0x32, 0x7B, 0x56, 0xD9, 0xAD, 0x8B, 0x0C };
// (หมายเหตุ: หากหน้า ChirpStack กรอกแบบ LSB ไว้อยู่แล้ว ให้สลับมาใช้: { 0x0C, 0x8B, 0xAD, 0xD9, 0x56, 0x7B, 0x32, 0x2F })
void os_getArtEui (u1_t* buf) { memcpy_P(buf, APPEUI, 8); }

// DEVEUI: ใน ChirpStack คือ d1b2824606880dcd
// LMIC ต้องใช้แบบ Little-endian (LSB first) กลับด้านเป็น cd0d88064682b2d1:
static const u1_t PROGMEM DEVEUI[8] = { 0xCD, 0x0D, 0x88, 0x06, 0x46, 0x82, 0xB2, 0xD1 };
void os_getDevEui (u1_t* buf) { memcpy_P(buf, DEVEUI, 8); }

// APPKEY: 7d3488d5f6b4d4159ac69658df468716 (Big-endian: MSB first ตามที่แสดงใน ChirpStack)
static const u1_t PROGMEM APPKEY[16] = { 0x7D, 0x34, 0x88, 0xD5, 0xF6, 0xB4, 0xD4, 0x15, 0x9A, 0xC6, 0x96, 0x58, 0xDF, 0x46, 0x87, 0x16 };
void os_getDevKey (u1_t* buf) { memcpy_P(buf, APPKEY, 16); }

static osjob_t sendjob;

// ----------------------------------------------------------------------------
// 3. กำหนดขา Pin ของ LoRa Shield (ตรงตามไฟล์แล็บเดิม)
// ----------------------------------------------------------------------------
const lmic_pinmap lmic_pins = {
    .nss = 10,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 7,
    .dio = {2, 5, 6}, // DIO0=D2, DIO1=D5, DIO2=D6
};

void do_send(osjob_t* j);

void onEvent (ev_t ev) {
    Serial.print(os_getTime());
    Serial.print(F(": "));
    switch(ev) {
        case EV_SCAN_TIMEOUT:
            Serial.println(F("EV_SCAN_TIMEOUT"));
            break;
        case EV_BEACON_FOUND:
            Serial.println(F("EV_BEACON_FOUND"));
            break;
        case EV_BEACON_MISSED:
            Serial.println(F("EV_BEACON_MISSED"));
            break;
        case EV_BEACON_TRACKED:
            Serial.println(F("EV_BEACON_TRACKED"));
            break;
        case EV_JOINING:
            Serial.println(F("[LoRaWAN] >>> EV_JOINING: กำลังส่ง Join-Request ไปยัง ChirpStack... <<<"));
            break;
        case EV_JOINED:
            Serial.println(F("\n========================================================"));
            Serial.println(F(" [LoRaWAN] >>> EV_JOINED: เชื่อมต่อ ChirpStack สำเร็จแล้ว! <<<"));
            Serial.println(F("========================================================"));
            {
              u4_t netid = 0;
              devaddr_t devaddr = 0;
              u1_t nwkKey[16];
              u1_t artKey[16];
              LMIC_getSessionKeys(&netid, &devaddr, nwkKey, artKey);
              Serial.print(F("Device Address (DevAddr): 0x"));
              Serial.println(devaddr, HEX);
            }
            // ปิดการเช็ก validation link ในการทดสอบ
            LMIC_setLinkCheckMode(0);
            break;
        case EV_JOIN_FAILED:
            Serial.println(F("[LoRaWAN] EV_JOIN_FAILED: เชื่อมต่อไม่สำเร็จ กรุณาเช็กความถี่หรือเสาอากาศ"));
            break;
        case EV_REJOIN_FAILED:
            Serial.println(F("[LoRaWAN] EV_REJOIN_FAILED"));
            break;
        case EV_TXCOMPLETE:
            Serial.println(F("[LoRaWAN] EV_TXCOMPLETE: ส่งข้อมูลสำเร็จ (รอรับ Downlink เรียบร้อย)"));
            if (LMIC.txrxFlags & TXRX_ACK) {
              Serial.println(F("[LoRaWAN] ได้รับ ACK จาก Gateway"));
            }
            // ตรวจสอบหากมี Downlink ส่งมาจาก AI Chat box หรือ Web Dashboard
            if (LMIC.dataLen) {
              Serial.print(F("[LoRaWAN] ได้รับ Downlink: "));
              Serial.print(LMIC.dataLen);
              Serial.print(F(" bytes | ข้อมูล: 0x"));
              
              uint8_t cmdByte = LMIC.frame[LMIC.dataBeg];
              if (cmdByte < 0x10) Serial.print('0');
              Serial.println(cmdByte, HEX);

              // สั่งงานไฟ LED ขา D4
              if (cmdByte == 0x01) {
                ledState = true;
                digitalWrite(PIN_NODE_LED, HIGH);
                Serial.println(F("[Control] LED บนบอร์ด (Pin D4) -> ON (เปิดไฟ)"));
              } else if (cmdByte == 0x00) {
                ledState = false;
                digitalWrite(PIN_NODE_LED, LOW);
                Serial.println(F("[Control] LED บนบอร์ด (Pin D4) -> OFF (ปิดไฟ)"));
              }
            }
            // กำหนดรอบการส่งข้อมูลครั้งถัดไป
            os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), do_send);
            break;
        case EV_LOST_TSYNC:
            Serial.println(F("EV_LOST_TSYNC"));
            break;
        case EV_RESET:
            Serial.println(F("EV_RESET"));
            break;
        case EV_RXCOMPLETE:
            Serial.println(F("EV_RXCOMPLETE"));
            break;
        case EV_LINK_DEAD:
            Serial.println(F("EV_LINK_DEAD"));
            break;
        case EV_LINK_ALIVE:
            Serial.println(F("EV_LINK_ALIVE"));
            break;
        case EV_TXSTART:
            Serial.println(F("[LoRaWAN] EV_TXSTART: กำลังส่งสัญญาณออกอากาศ RF..."));
            break;
        case EV_TXCANCELED:
            Serial.println(F("EV_TXCANCELED"));
            break;
        case EV_JOIN_TXCOMPLETE:
            Serial.println(F("[LoRaWAN] EV_JOIN_TXCOMPLETE: ส่งคำขอ Join แล้ว (กำลังรอรับ Join-Accept จาก Server)..."));
            break;
        default:
            Serial.print(F("Event อื่นๆ: "));
            Serial.println((unsigned) ev);
            break;
    }
}

void do_send(osjob_t* j){
    // ตรวจสอบว่าไม่มีงานส่งเดิมค้างอยู่
    if (LMIC.opmode & OP_TXRXPEND) {
        Serial.println(F("OP_TXRXPEND: กำลังรอดำเนินการส่ง ไม่สามารถส่งซ้ำได้"));
    } else {
        if (TEST_MODE_ONLY) {
            // โหมดทดสอบการเชื่อมต่อ: ส่งข้อความ Hello ยืนยันการเชื่อมต่อ
            static uint8_t testPayload[] = "Hello ChirpStack";
            LMIC_setTxData2(1, testPayload, sizeof(testPayload) - 1, 0);
            Serial.println(F("[Uplink] สั่งส่งข้อมูลทดสอบ 'Hello ChirpStack' เข้าคิวแล้ว..."));
        } else {
            // โหมดทำงานจริง: อ่านค่าจากเซนเซอร์ LDR ส่ง 4 Bytes
            uint16_t lightRaw = (uint16_t)analogRead(PIN_LIGHT_AO);
            bool lightThresholdExceeded = (digitalRead(PIN_LIGHT_DO) == LOW);

            uint8_t sensorPayload[4];
            sensorPayload[0] = (uint8_t)((lightRaw >> 8) & 0xFF);
            sensorPayload[1] = (uint8_t)(lightRaw & 0xFF);
            sensorPayload[2] = lightThresholdExceeded ? 0x01 : 0x00;
            sensorPayload[3] = ledState ? 0x01 : 0x00;

            float brightnessPercent = ((1023.0 - (float)lightRaw) / 1023.0) * 100.0;
            if (brightnessPercent < 0) brightnessPercent = 0;
            if (brightnessPercent > 100) brightnessPercent = 100;

            Serial.print(F("[Sensors] Light AO(A0)="));
            Serial.print(lightRaw);
            Serial.print(F(" ("));
            Serial.print(brightnessPercent, 1);
            Serial.print(F("%) | DO(D3)="));
            Serial.print(lightThresholdExceeded ? F("BRIGHT") : F("DARK"));
            Serial.print(F(" | LED(D4)="));
            Serial.println(ledState ? F("ON") : F("OFF"));

            LMIC_setTxData2(1, sensorPayload, sizeof(sensorPayload), 0);
            Serial.println(F("[Uplink] สั่งส่งแพ็กเกจเซนเซอร์ 4 Bytes เข้าคิวแล้ว..."));
        }
    }
}

void setup() {
    Serial.begin(115200);
    while (!Serial && millis() < 3000) {}

    pinMode(PIN_NODE_LED, OUTPUT);
    digitalWrite(PIN_NODE_LED, LOW);
    pinMode(PIN_LIGHT_AO, INPUT);
    pinMode(PIN_LIGHT_DO, INPUT);

    Serial.println(F("========================================================"));
    Serial.println(F(" Arduino UNO R4 + LoRa Shield (LMIC OTAA Connection Test)"));
    Serial.println(F(" Target: lora.kmitl.ac.th (AS923 / SF12)"));
    Serial.print(F(" Mode  : "));
    Serial.println(TEST_MODE_ONLY ? F("TEST_MODE_ONLY (ส่งข้อความทดสอบการเชื่อมต่อ)") : F("SENSOR_MODE (ส่งค่า LDR)"));
    Serial.println(F("========================================================"));

    // เริ่มต้นระบบ LMIC
    os_init();
    LMIC_reset();

    // ขยาย Receive Window สำหรับบอร์ด ARM/Renesas (Arduino UNO R4) ป้องกัน Clock Drift
    LMIC_setClockError(MAX_CLOCK_ERROR * 10 / 100);

    // ตั้งค่าความถี่ AS923 ตามแล็บ (923.2 MHz / SF12)
    LMIC_setupChannel(
        0,
        923200000,
        DR_RANGE_MAP(DR_SF12, DR_SF7),
        BAND_CENTI
    );
    LMIC_setDrTxpow(DR_SF12, 14);

    // เริ่มต้นคำสั่งส่งและ Join OTAA
    do_send(&sendjob);
}

void loop() {
    os_runloop_once();
}
