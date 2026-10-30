/**
 * ============================================================================
 * ChirpStack v4 Payload Codec (สำหรับใส่ใน Device Profile บน https://lora.kmitl.ac.th/)
 * ============================================================================
 * หมายเหตุ: แม้ไม่ใส่ Codec นี้ ตัวเซิร์ฟเวอร์ Node.js บน Raspberry Pi ก็สามารถถอดรหัส
 * จากฟิลด์ Base64 `data` ได้โดยอัตโนมัติอยู่แล้ว แต่การใส่ Codec นี้จะช่วยให้เห็นค่า JSON
 * บนหน้าเว็บของ lora.kmitl.ac.th ได้ง่ายขึ้นด้วย
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
  var lightPercent = Number(((lightRaw / 1023.0) * 100.0).toFixed(1));
  var infraredDetected = bytes[2] === 1;
  var ledState = (bytes.length >= 4 && bytes[3] === 1) ? "ON" : "OFF";

  return {
    data: {
      light_raw: lightRaw,
      light_percent: lightPercent,
      infrared_detected: infraredDetected,
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

