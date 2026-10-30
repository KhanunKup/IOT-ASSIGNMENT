"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeLoRaBinaryPayload = decodeLoRaBinaryPayload;
exports.initMqttClient = initMqttClient;
exports.publishToMqtt = publishToMqtt;
exports.publishPiSensorsToMqtt = publishPiSensorsToMqtt;
exports.sendLoRaDownlinkLed = sendLoRaDownlinkLed;
const mqtt_1 = __importDefault(require("mqtt"));
const config_1 = require("../config");
const led_1 = require("../hardware/led");
const state_1 = require("../state");
let client = null;
/**
 * Decode 5-byte binary payload from Arduino UNO R4 LoRa Node:
 *   Byte 0..1: uint16_t lightRaw (0 - 1023) from LDR AO (Pin A0)
 *   Byte 2:    uint8_t  infraredDetected (1 = obstacle detected, 0 = clear) from IR DO (Pin D3)
 *   Byte 3:    uint8_t  ledState (1 = ON, 0 = OFF) on Pin D4
 *   Byte 4:    uint8_t  lightDigital (1 = bright / เกินเกณฑ์ Trimpot, 0 = dark) from LDR DO (Pin D5)
 */
function decodeLoRaBinaryPayload(base64Data) {
    try {
        const buf = Buffer.from(base64Data, "base64");
        if (buf.length < 3)
            return null;
        const lightRaw = (buf[0] << 8) | buf[1];
        const lightPercent = Number(Math.min(100, Math.max(0, (lightRaw / 1023) * 100)).toFixed(1));
        const infraredDetected = buf[2] === 1;
        const ledState = buf.length >= 4 && buf[3] === 1 ? "ON" : "OFF";
        const lightDigital = buf.length >= 5 ? buf[4] === 1 : lightPercent >= 50;
        return {
            lightRaw,
            lightPercent,
            lightDigital,
            infraredDetected,
            ledState,
        };
    }
    catch {
        return null;
    }
}
function initMqttClient() {
    console.log(`[MQTT] Connecting to broker: ${config_1.CONFIG.mqttBrokerUrl} ...`);
    const options = {
        clientId: config_1.CONFIG.mqttClientId,
        reconnectPeriod: 5000,
        connectTimeout: 10000,
    };
    if (config_1.CONFIG.mqttUsername) {
        options.username = config_1.CONFIG.mqttUsername;
        options.password = config_1.CONFIG.mqttPassword;
    }
    client = mqtt_1.default.connect(config_1.CONFIG.mqttBrokerUrl, options);
    client.on("connect", () => {
        state_1.systemState.mqttConnected = true;
        console.log(`[MQTT] Connected to ${config_1.CONFIG.mqttBrokerUrl}`);
        const subscribeTopics = [
            config_1.CONFIG.topics.piTemperature,
            config_1.CONFIG.topics.piHumidity,
            config_1.CONFIG.topics.piDistance,
            config_1.CONFIG.topics.piLed,
            config_1.CONFIG.topics.loraNode1Data,
            config_1.CONFIG.topics.loraNode1Control,
            "lora/+/data",
            "application/+/device/+/event/up",
        ];
        client?.subscribe(subscribeTopics, (err) => {
            if (err) {
                console.error("[MQTT] Subscription error:", err.message);
            }
            else {
                console.log("[MQTT] Subscribed to Pi & ChirpStack LoRa topics:", subscribeTopics.join(", "));
            }
        });
    });
    client.on("error", (err) => {
        state_1.systemState.mqttConnected = false;
        console.warn("[MQTT] Connection error:", err.message);
    });
    client.on("offline", () => {
        state_1.systemState.mqttConnected = false;
    });
    client.on("message", async (topic, payloadBuf) => {
        const payloadStr = payloadBuf.toString("utf-8").trim();
        state_1.systemState.updateMqttCache(topic, payloadStr);
        // 1. Handle remote LED command for Raspberry Pi (`pi/device/led`)
        if (topic === config_1.CONFIG.topics.piLed) {
            const upper = payloadStr.toUpperCase();
            if (upper === "ON" || upper === "OFF") {
                if (state_1.systemState.pi.ledState !== upper) {
                    await (0, led_1.setPiLedState)(upper);
                }
            }
            return;
        }
        // 2. Handle ChirpStack Uplink (`application/<appId>/device/<devEui>/event/up`)
        if (topic.startsWith("application/") && topic.endsWith("/event/up")) {
            try {
                const parsed = JSON.parse(payloadStr);
                const devEui = parsed.deviceInfo?.devEui ||
                    parsed.devEUI ||
                    config_1.CONFIG.chirpstackDevEui;
                const deviceName = parsed.deviceInfo?.deviceName ||
                    parsed.deviceName ||
                    "arduino-r4-lora-node1";
                const rssi = parsed.rxInfo?.[0]?.rssi;
                const snr = parsed.rxInfo?.[0]?.snr ?? parsed.rxInfo?.[0]?.loRaSNR;
                let lightRaw = state_1.systemState.loraNode1.lightRaw;
                let lightPercent = state_1.systemState.loraNode1.lightPercent;
                let lightDigital = state_1.systemState.loraNode1.lightDigital;
                let infraredDetected = state_1.systemState.loraNode1.infraredDetected;
                let ledState = state_1.systemState.loraNode1.ledState;
                // If ChirpStack Payload Codec decoded `object`
                if (parsed.object && typeof parsed.object === "object") {
                    const obj = parsed.object;
                    if (typeof obj.light_raw === "number")
                        lightRaw = obj.light_raw;
                    if (typeof obj.light_raw_a0 === "number")
                        lightRaw = obj.light_raw_a0;
                    if (typeof obj.light_percent === "number")
                        lightPercent = obj.light_percent;
                    else if (typeof lightRaw === "number")
                        lightPercent = Number(((lightRaw / 1023) * 100).toFixed(1));
                    if (typeof obj.light_digital === "boolean")
                        lightDigital = obj.light_digital;
                    else if (typeof obj.light_digital_d5 === "boolean")
                        lightDigital = obj.light_digital_d5;
                    if (typeof obj.infrared_detected === "boolean")
                        infraredDetected = obj.infrared_detected;
                    if (obj.led_state === "ON" || obj.led_state === "OFF")
                        ledState = obj.led_state;
                }
                else if (typeof parsed.data === "string" && parsed.data.length > 0) {
                    // Decode raw Base64 bytes directly
                    const decoded = decodeLoRaBinaryPayload(parsed.data);
                    if (decoded) {
                        lightRaw = decoded.lightRaw;
                        lightPercent = decoded.lightPercent;
                        lightDigital = decoded.lightDigital;
                        infraredDetected = decoded.infraredDetected;
                        ledState = decoded.ledState;
                    }
                }
                state_1.systemState.loraNode1 = {
                    devEui,
                    deviceName,
                    lightRaw,
                    lightPercent,
                    lightDigital,
                    infraredDetected,
                    ledState,
                    rssi,
                    snr,
                    updatedAt: new Date().toISOString(),
                };
                state_1.systemState.recordHistoryPoint();
                // Republish normalized JSON to `lora/node1/data` (matching the diagram)
                const normalizedPayload = JSON.stringify(state_1.systemState.loraNode1);
                publishToMqtt(config_1.CONFIG.topics.loraNode1Data, normalizedPayload);
            }
            catch (err) {
                console.warn("[MQTT] Failed to parse ChirpStack uplink JSON:", err);
            }
            return;
        }
        // 3. Handle direct JSON publish to `lora/node1/data`
        if (topic === config_1.CONFIG.topics.loraNode1Data) {
            try {
                const data = JSON.parse(payloadStr);
                if (typeof data === "object" && data !== null) {
                    if (typeof data.lightRaw === "number") {
                        state_1.systemState.loraNode1.lightRaw = data.lightRaw;
                    }
                    if (typeof data.light_raw_a0 === "number") {
                        state_1.systemState.loraNode1.lightRaw = data.light_raw_a0;
                    }
                    if (typeof data.lightPercent === "number") {
                        state_1.systemState.loraNode1.lightPercent = data.lightPercent;
                    }
                    else if (typeof data.light_percent === "number") {
                        state_1.systemState.loraNode1.lightPercent = data.light_percent;
                    }
                    if (typeof data.lightDigital === "boolean") {
                        state_1.systemState.loraNode1.lightDigital = data.lightDigital;
                    }
                    else if (typeof data.light_digital === "boolean") {
                        state_1.systemState.loraNode1.lightDigital = data.light_digital;
                    }
                    else if (typeof data.light_digital_d5 === "boolean") {
                        state_1.systemState.loraNode1.lightDigital = data.light_digital_d5;
                    }
                    if (typeof data.infraredDetected === "boolean") {
                        state_1.systemState.loraNode1.infraredDetected = data.infraredDetected;
                    }
                    else if (typeof data.infrared_detected === "boolean") {
                        state_1.systemState.loraNode1.infraredDetected = data.infrared_detected;
                    }
                    if (data.ledState === "ON" || data.ledState === "OFF") {
                        state_1.systemState.loraNode1.ledState = data.ledState;
                    }
                    state_1.systemState.loraNode1.updatedAt = new Date().toISOString();
                }
            }
            catch {
                // Ignore non-JSON payload
            }
        }
    });
}
/**
 * Publish a message to any MQTT topic and update local cache immediately
 */
function publishToMqtt(topic, payload, retain = false) {
    state_1.systemState.updateMqttCache(topic, payload);
    if (client && state_1.systemState.mqttConnected) {
        client.publish(topic, payload, { retain });
        return true;
    }
    return false;
}
/**
 * Publish Raspberry Pi local sensor readings to MQTT Broker (Block 4 in diagram)
 */
function publishPiSensorsToMqtt() {
    publishToMqtt(config_1.CONFIG.topics.piTemperature, String(state_1.systemState.pi.temperature), true);
    publishToMqtt(config_1.CONFIG.topics.piHumidity, String(state_1.systemState.pi.humidity), true);
    publishToMqtt(config_1.CONFIG.topics.piDistance, String(state_1.systemState.pi.distanceCm), true);
    publishToMqtt(config_1.CONFIG.topics.piLed, state_1.systemState.pi.ledState, true);
}
/**
 * Send a Downlink command to Arduino UNO R4 LoRa Node via ChirpStack MQTT
 * Controls the LED on Pin D4 of the Arduino UNO R4
 */
function sendLoRaDownlinkLed(action) {
    const targetState = action === "TOGGLE"
        ? state_1.systemState.loraNode1.ledState === "ON"
            ? "OFF"
            : "ON"
        : action;
    state_1.systemState.loraNode1.ledState = targetState;
    state_1.systemState.loraNode1.updatedAt = new Date().toISOString();
    // 1 byte payload: 0x01 for ON, 0x00 for OFF
    const byteVal = targetState === "ON" ? 0x01 : 0x00;
    const base64Payload = Buffer.from([byteVal]).toString("base64");
    const devEui = state_1.systemState.loraNode1.devEui !== "0000000000000000"
        ? state_1.systemState.loraNode1.devEui
        : config_1.CONFIG.chirpstackDevEui;
    const downlinkTopic = `application/${config_1.CONFIG.chirpstackAppId}/device/${devEui}/command/down`;
    const chirpstackDownlinkMsg = JSON.stringify({
        devEui,
        confirmed: false,
        fPort: config_1.CONFIG.chirpstackDownlinkFPort,
        data: base64Payload,
    });
    const mqttPublished = publishToMqtt(downlinkTopic, chirpstackDownlinkMsg);
    publishToMqtt(config_1.CONFIG.topics.loraNode1Control, targetState);
    publishToMqtt(config_1.CONFIG.topics.loraNode1Data, JSON.stringify(state_1.systemState.loraNode1));
    return {
        targetState,
        downlinkTopic,
        base64Payload,
        mqttPublished,
    };
}
