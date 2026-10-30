import mqtt, { MqttClient } from "mqtt";
import { CONFIG } from "../config";
import { setPiLedState } from "../hardware/led";
import { systemState } from "../state";

let client: MqttClient | null = null;

/**
 * Decode 4-byte binary payload from Arduino UNO R4 LoRa Node:
 *   Byte 0..1: uint16_t lightRaw (0 - 1023) from LDR AO (Pin A0)
 *   Byte 2:    uint8_t  lightDigital (1 = bright / เกินเกณฑ์ Trimpot, 0 = dark) from LDR DO (Pin D5)
 *   Byte 3:    uint8_t  ledState (1 = ON, 0 = OFF) on Pin D4
 */
export function decodeLoRaBinaryPayload(base64Data: string): {
  lightRaw: number;
  lightPercent: number;
  lightDigital: boolean;
  ledState: "ON" | "OFF";
} | null {
  try {
    const buf = Buffer.from(base64Data, "base64");
    if (buf.length < 3) return null;

    const lightRaw = (buf[0] << 8) | buf[1];
    // โมดูล LM393 LDR: ค่า ADC ยิ่งน้อย = แสงยิ่งสว่าง (แปลงเป็น % ความสว่าง 0 - 100%)
    const lightPercent = Number(
      Math.min(100, Math.max(0, ((1023 - lightRaw) / 1023) * 100)).toFixed(1)
    );
    const lightDigital = buf[2] === 1;
    const ledState: "ON" | "OFF" = buf.length >= 4 && buf[3] === 1 ? "ON" : "OFF";

    return {
      lightRaw,
      lightPercent,
      lightDigital,
      ledState,
    };
  } catch {
    return null;
  }
}

export function initMqttClient(): void {
  console.log(`[MQTT] Connecting to broker: ${CONFIG.mqttBrokerUrl} ...`);

  const options: mqtt.IClientOptions = {
    clientId: CONFIG.mqttClientId,
    reconnectPeriod: 5000,
    connectTimeout: 10000,
  };

  if (CONFIG.mqttUsername) {
    options.username = CONFIG.mqttUsername;
    options.password = CONFIG.mqttPassword;
  }

  client = mqtt.connect(CONFIG.mqttBrokerUrl, options);

  client.on("connect", () => {
    systemState.mqttConnected = true;
    console.log(`[MQTT] Connected to ${CONFIG.mqttBrokerUrl}`);

    const subscribeTopics = [
      CONFIG.topics.piTemperature,
      CONFIG.topics.piHumidity,
      CONFIG.topics.piDistance,
      CONFIG.topics.piLed,
      CONFIG.topics.loraNode1Data,
      CONFIG.topics.loraNode1Control,
      "lora/+/data",
      "application/+/device/+/event/up",
    ];

    client?.subscribe(subscribeTopics, (err) => {
      if (err) {
        console.error("[MQTT] Subscription error:", err.message);
      } else {
        console.log(
          "[MQTT] Subscribed to Pi & ChirpStack LoRa topics:",
          subscribeTopics.join(", ")
        );
      }
    });
  });

  client.on("error", (err) => {
    systemState.mqttConnected = false;
    console.warn("[MQTT] Connection error:", err.message);
  });

  client.on("offline", () => {
    systemState.mqttConnected = false;
  });

  client.on("message", async (topic, payloadBuf) => {
    const payloadStr = payloadBuf.toString("utf-8").trim();
    systemState.updateMqttCache(topic, payloadStr);

    // 1. Handle remote LED command for Raspberry Pi (`pi/device/led`)
    if (topic === CONFIG.topics.piLed) {
      const upper = payloadStr.toUpperCase();
      if (upper === "ON" || upper === "OFF") {
        if (systemState.pi.ledState !== upper) {
          await setPiLedState(upper);
        }
      }
      return;
    }

    // 2. Handle ChirpStack Uplink (`application/<appId>/device/<devEui>/event/up`)
    if (topic.startsWith("application/") && topic.endsWith("/event/up")) {
      try {
        const parsed = JSON.parse(payloadStr);
        const devEui =
          parsed.deviceInfo?.devEui ||
          parsed.devEUI ||
          CONFIG.chirpstackDevEui;
        const deviceName =
          parsed.deviceInfo?.deviceName ||
          parsed.deviceName ||
          "arduino-r4-lora-node1";
        const rssi = parsed.rxInfo?.[0]?.rssi;
        const snr = parsed.rxInfo?.[0]?.snr ?? parsed.rxInfo?.[0]?.loRaSNR;

        let lightRaw = systemState.loraNode1.lightRaw;
        let lightPercent = systemState.loraNode1.lightPercent;
        let lightDigital = systemState.loraNode1.lightDigital;
        let ledState = systemState.loraNode1.ledState;

        // If ChirpStack Payload Codec decoded `object`
        if (parsed.object && typeof parsed.object === "object") {
          const obj = parsed.object;
          if (typeof obj.light_raw === "number") lightRaw = obj.light_raw;
          if (typeof obj.light_raw_a0 === "number") lightRaw = obj.light_raw_a0;
          if (typeof obj.light_percent === "number")
            lightPercent = obj.light_percent;
          else if (typeof lightRaw === "number")
            lightPercent = Number(
              (((1023 - lightRaw) / 1023) * 100).toFixed(1)
            );

          if (typeof obj.light_digital === "boolean")
            lightDigital = obj.light_digital;
          else if (typeof obj.light_digital_d5 === "boolean")
            lightDigital = obj.light_digital_d5;

          if (obj.led_state === "ON" || obj.led_state === "OFF")
            ledState = obj.led_state;
        } else if (typeof parsed.data === "string" && parsed.data.length > 0) {
          // Decode raw Base64 bytes directly
          const decoded = decodeLoRaBinaryPayload(parsed.data);
          if (decoded) {
            lightRaw = decoded.lightRaw;
            lightPercent = decoded.lightPercent;
            lightDigital = decoded.lightDigital;
            ledState = decoded.ledState;
          }
        }

        systemState.loraNode1 = {
          devEui,
          deviceName,
          lightRaw,
          lightPercent,
          lightDigital,
          ledState,
          rssi,
          snr,
          updatedAt: new Date().toISOString(),
        };

        systemState.recordHistoryPoint();

        // Republish normalized JSON to `lora/node1/data` (matching the diagram)
        const normalizedPayload = JSON.stringify(systemState.loraNode1);
        publishToMqtt(CONFIG.topics.loraNode1Data, normalizedPayload);
      } catch (err) {
        console.warn("[MQTT] Failed to parse ChirpStack uplink JSON:", err);
      }
      return;
    }

    // 3. Handle direct JSON publish to `lora/node1/data`
    if (topic === CONFIG.topics.loraNode1Data) {
      try {
        const data = JSON.parse(payloadStr);
        if (typeof data === "object" && data !== null) {
          if (typeof data.lightRaw === "number") {
            systemState.loraNode1.lightRaw = data.lightRaw;
          }
          if (typeof data.light_raw_a0 === "number") {
            systemState.loraNode1.lightRaw = data.light_raw_a0;
          }
          if (typeof data.lightPercent === "number") {
            systemState.loraNode1.lightPercent = data.lightPercent;
          } else if (typeof data.light_percent === "number") {
            systemState.loraNode1.lightPercent = data.light_percent;
          }
          if (typeof data.lightDigital === "boolean") {
            systemState.loraNode1.lightDigital = data.lightDigital;
          } else if (typeof data.light_digital === "boolean") {
            systemState.loraNode1.lightDigital = data.light_digital;
          } else if (typeof data.light_digital_d5 === "boolean") {
            systemState.loraNode1.lightDigital = data.light_digital_d5;
          }
          if (data.ledState === "ON" || data.ledState === "OFF") {
            systemState.loraNode1.ledState = data.ledState;
          }
          systemState.loraNode1.updatedAt = new Date().toISOString();
        }
      } catch {
        // Ignore non-JSON payload
      }
    }
  });
}

/**
 * Publish a message to any MQTT topic and update local cache immediately
 */
export function publishToMqtt(
  topic: string,
  payload: string,
  retain: boolean = false
): boolean {
  systemState.updateMqttCache(topic, payload);
  if (client && systemState.mqttConnected) {
    client.publish(topic, payload, { retain });
    return true;
  }
  return false;
}

/**
 * Publish Raspberry Pi local sensor readings to MQTT Broker (Block 4 in diagram)
 */
export function publishPiSensorsToMqtt(): void {
  publishToMqtt(
    CONFIG.topics.piTemperature,
    String(systemState.pi.temperature),
    true
  );
  publishToMqtt(
    CONFIG.topics.piHumidity,
    String(systemState.pi.humidity),
    true
  );
  publishToMqtt(
    CONFIG.topics.piDistance,
    String(systemState.pi.distanceCm),
    true
  );
  publishToMqtt(CONFIG.topics.piLed, systemState.pi.ledState, true);
}

/**
 * Send a Downlink command to Arduino UNO R4 LoRa Node via ChirpStack MQTT
 * Controls the LED on Pin D4 of the Arduino UNO R4
 */
export function sendLoRaDownlinkLed(action: "ON" | "OFF" | "TOGGLE"): {
  targetState: "ON" | "OFF";
  downlinkTopic: string;
  base64Payload: string;
  mqttPublished: boolean;
} {
  const targetState: "ON" | "OFF" =
    action === "TOGGLE"
      ? systemState.loraNode1.ledState === "ON"
        ? "OFF"
        : "ON"
      : action;

  systemState.loraNode1.ledState = targetState;
  systemState.loraNode1.updatedAt = new Date().toISOString();

  // 1 byte payload: 0x01 for ON, 0x00 for OFF
  const byteVal = targetState === "ON" ? 0x01 : 0x00;
  const base64Payload = Buffer.from([byteVal]).toString("base64");

  const devEui =
    systemState.loraNode1.devEui !== "0000000000000000"
      ? systemState.loraNode1.devEui
      : CONFIG.chirpstackDevEui;

  const downlinkTopic = `application/${CONFIG.chirpstackAppId}/device/${devEui}/command/down`;

  const chirpstackDownlinkMsg = JSON.stringify({
    devEui,
    confirmed: false,
    fPort: CONFIG.chirpstackDownlinkFPort,
    data: base64Payload,
  });

  const mqttPublished = publishToMqtt(downlinkTopic, chirpstackDownlinkMsg);
  publishToMqtt(CONFIG.topics.loraNode1Control, targetState);
  publishToMqtt(
    CONFIG.topics.loraNode1Data,
    JSON.stringify(systemState.loraNode1)
  );

  return {
    targetState,
    downlinkTopic,
    base64Payload,
    mqttPublished,
  };
}
