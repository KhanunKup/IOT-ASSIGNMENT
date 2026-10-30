/**
 * ============================================================================
 * ChirpStack v4 Payload Codec (สำหรับใส่ใน Device Profile บน https://lora.kmitl.ac.th/)
 * ============================================================================
 * รองรับ Payload 5 Bytes จาก Arduino UNO R4 + LDR LM393 Module 4 ขา:
 *   - Byte 0..1: uint16_t lightRaw (ขา AO เข้า A0: 0 - 1023)
 *   - Byte 2:    uint8_t  infraredDetected (ขา DO เข้า D3: 1 = พบวัตถุ, 0 = ไม่พบ)
 *   - Byte 3:    uint8_t  ledState (ขา D4: 1 = ON, 0 = OFF)
 *   - Byte 4:    uint8_t  lightDigital (ขา DO เข้า D5: 1 = สว่างเกินเกณฑ์ Trimpot, 0 = มืด)
 */

// Decode uplink function.
function decodeUplink(input) {
  var bytes = input.bytes;
  if (!bytes || bytes.length < 3) {
    return {
      errors: ["Payload too short (expected 4-5 bytes)"]
    };
  }

  var lightRaw = (bytes[0] << 8) | bytes[1];
  var lightPercent = Number(((lightRaw / 1023.0) * 100.0).toFixed(1));
  var infraredDetected = bytes[2] === 1;
  var ledState = (bytes.length >= 4 && bytes[3] === 1) ? "ON" : "OFF";
  var lightDigital = (bytes.length >= 5 && bytes[4] === 1);

  return {
    data: {
      light_raw_a0: lightRaw,
      light_percent: lightPercent,
      light_digital_d5: lightDigital,
      light_status: lightDigital ? "สว่างเกินเกณฑ์ Trimpot (Bright)" : "มืดกว่าเกณฑ์ Trimpot (Dark)",
      infrared_detected: infraredDetected,
      infrared_status: infraredDetected ? "ตรวจพบวัตถุ (Obstacle)" : "ปกติ (Clear)",
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
