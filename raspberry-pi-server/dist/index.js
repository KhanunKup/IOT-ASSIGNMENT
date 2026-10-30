"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./api/routes");
const config_1 = require("./config");
const sht31_1 = require("./hardware/sht31");
const ultrasonic_1 = require("./hardware/ultrasonic");
const mcpServer_1 = require("./mcp/mcpServer");
const mqttClient_1 = require("./mqtt/mqttClient");
const state_1 = require("./state");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static Web Dashboard from /public
const publicDir = path_1.default.resolve(__dirname, "../public");
app.use(express_1.default.static(publicDir));
// Mount REST API routes (Block 7: HTTP REST API)
(0, routes_1.mountApiRoutes)(app);
// Mount MCP Server routes (Block 2: MCP Server HTTP/JSON & SSE)
(0, mcpServer_1.mountMcpRoutes)(app);
/**
 * Poll Raspberry Pi local sensors (SHT31 + Ultrasonic HC-SR04) and publish to MQTT
 */
async function pollPiSensors() {
    try {
        const [sht, ultra] = await Promise.all([(0, sht31_1.readSht31)(), (0, ultrasonic_1.readUltrasonic)()]);
        state_1.systemState.pi.temperature = sht.temperature;
        state_1.systemState.pi.humidity = sht.humidity;
        state_1.systemState.pi.distanceCm = ultra.distanceCm;
        state_1.systemState.pi.simulated = sht.simulated && ultra.simulated;
        state_1.systemState.pi.updatedAt = new Date().toISOString();
        state_1.systemState.recordHistoryPoint();
        (0, mqttClient_1.publishPiSensorsToMqtt)();
    }
    catch (err) {
        console.error("[Sensor Poll] Error polling Raspberry Pi sensors:", err);
    }
}
async function startServer() {
    // Initialize MQTT Broker connection
    (0, mqttClient_1.initMqttClient)();
    // Initial sensor read
    await pollPiSensors();
    // Periodic sensor polling loop
    setInterval(pollPiSensors, config_1.CONFIG.sensorPollIntervalMs);
    app.listen(config_1.CONFIG.port, "0.0.0.0", () => {
        console.log("============================================================");
        console.log(" Raspberry Pi 4 IoT MCP Server + REST API + Web Dashboard");
        console.log("============================================================");
        console.log(` Web Dashboard : http://localhost:${config_1.CONFIG.port}`);
        console.log(` REST API      : http://localhost:${config_1.CONFIG.port}/api/status`);
        console.log(` MCP (SSE)     : http://localhost:${config_1.CONFIG.port}/sse`);
        console.log(` MCP (HTTP)    : http://localhost:${config_1.CONFIG.port}/mcp`);
        console.log(` MQTT Broker   : ${config_1.CONFIG.mqttBrokerUrl}`);
        console.log(` Hardware Mode : ${config_1.CONFIG.simulateHardware ? "SIMULATION (Fallback Active)" : "REAL HARDWARE (I2C/GPIO)"}`);
        console.log("============================================================");
    });
}
startServer();
