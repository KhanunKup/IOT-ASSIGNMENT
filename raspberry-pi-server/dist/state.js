"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemState = void 0;
class SystemState {
    pi = {
        temperature: 26.5,
        humidity: 62.0,
        distanceCm: 120.0,
        ledState: "OFF",
        simulated: true,
        updatedAt: new Date().toISOString(),
    };
    loraNode1 = {
        devEui: "0000000000000000",
        deviceName: "arduino-r4-lora-node1",
        lightRaw: 680,
        lightPercent: 66.5,
        lightDigital: true,
        infraredDetected: false,
        ledState: "OFF",
        rssi: -78,
        snr: 9.5,
        updatedAt: new Date().toISOString(),
    };
    mqttConnected = false;
    mqttMessagesCache = {};
    history = [];
    maxHistoryLength = 50;
    recordHistoryPoint() {
        this.history.push({
            timestamp: new Date().toISOString(),
            piTemperature: this.pi.temperature,
            piHumidity: this.pi.humidity,
            piDistanceCm: this.pi.distanceCm,
            loraLightPercent: this.loraNode1.lightPercent,
            loraLightDigital: this.loraNode1.lightDigital,
            loraInfraredDetected: this.loraNode1.infraredDetected,
        });
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
    }
    updateMqttCache(topic, payload) {
        this.mqttMessagesCache[topic] = {
            payload,
            updatedAt: new Date().toISOString(),
        };
    }
}
exports.systemState = new SystemState();
