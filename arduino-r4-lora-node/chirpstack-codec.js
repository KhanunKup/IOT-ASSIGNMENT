/**
 * ============================================================================
 * ChirpStack v4 Payload Codec (สำหรับใส่ใน Device Profile บน https://lora.kmitl.ac.th/)
 * ============================================================================
 * รองรับ Payload 4 Bytes จาก Arduino UNO R4 + LDR LM393 Module (4 ขา):
 *   - Byte 0..1: uint16_t lightRaw (ขา AO เข้า A0: 0 - 1023)
 *   - Byte 2:    uint8_t  lightDigital (ขา DO เข้า D5: 1 = สว่างเกินเกณฑ์ Trimpot, 0 = มืด)
 *   - Byte 3:    uint8_t  ledState (ขา D4: 1 = ON, 0 = OFF)
 */

// Decode uplink function.
function decodeUplink(input) {
  var bytes = input.bytes;
  if (!bytes || bytes.length < 3) {
    return {
      errors: ["Payload too short (expected 4 bytes)"]
    };
  }

  var lightRaw = (bytes[0] << 8) | bytes[1];
  // โมดูล LM393 LDR: ค่า ADC ยิ่งน้อย = แสงสว่างมาก (แปลงเป็น % ความสว่าง 0 - 100%)
  var lightPercent = Number((((1023.0 - lightRaw) / 1023.0) * 100.0).toFixed(1));
  if (lightPercent < 0) lightPercent = 0;
  if (lightPercent > 100) lightPercent = 100;

  var lightDigital = bytes[2] === 1;
  var ledState = (bytes.length >= 4 && bytes[3] === 1) ? "ON" : "OFF";

  return {
    data: {
      light_raw_a0: lightRaw,
      light_percent: lightPercent,
      light_digital_d5: lightDigital,
      light_status: lightDigital ? "สว่างเกินเกณฑ์ Trimpot (Bright)" : "มืดกว่าเกณฑ์ Trimpot (Dark)",
      led_state: ledState
    }
  };
}

// Encode downlink function.
function encodeDownlink(input) {
  var state = (input.data && input.data.led_state === "ON") ? 1 : 0;
  return {
    bytes: [state],
    fPort: 1
  };
}
