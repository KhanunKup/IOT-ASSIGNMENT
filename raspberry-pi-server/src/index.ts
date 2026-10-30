import cors from "cors";
import express from "express";
import path from "path";
import { mountApiRoutes } from "./api/routes";
import { CONFIG } from "./config";
import { readSht31 } from "./hardware/sht31";
import { readUltrasonic } from "./hardware/ultrasonic";
import { mountMcpRoutes } from "./mcp/mcpServer";
import { initMqttClient, publishPiSensorsToMqtt } from "./mqtt/mqttClient";
import { systemState } from "./state";

const app = express();

app.use(cors());
app.use(express.json());

// Serve static Web Dashboard from /public
const publicDir = path.resolve(__dirname, "../public");
app.use(express.static(publicDir));

// Mount REST API routes (Block 7: HTTP REST API)
mountApiRoutes(app);

// Mount MCP Server routes (Block 2: MCP Server HTTP/JSON & SSE)
mountMcpRoutes(app);

/**
 * Poll Raspberry Pi local sensors (SHT31 + Ultrasonic HC-SR04) and publish to MQTT
 */
async function pollPiSensors(): Promise<void> {
  try {
    const [sht, ultra] = await Promise.all([readSht31(), readUltrasonic()]);

    systemState.pi.temperature = sht.temperature;
    systemState.pi.humidity = sht.humidity;
    systemState.pi.distanceCm = ultra.distanceCm;
    systemState.pi.simulated = sht.simulated && ultra.simulated;
    systemState.pi.updatedAt = new Date().toISOString();

    systemState.recordHistoryPoint();
    publishPiSensorsToMqtt();
  } catch (err) {
    console.error("[Sensor Poll] Error polling Raspberry Pi sensors:", err);
  }
}

async function startServer(): Promise<void> {
  // Initialize MQTT Broker connection
  initMqttClient();

  // Initial sensor read
  await pollPiSensors();

  // Periodic sensor polling loop
  setInterval(pollPiSensors, CONFIG.sensorPollIntervalMs);

  app.listen(CONFIG.port, "0.0.0.0", () => {
    console.log("============================================================");
    console.log(" Raspberry Pi 4 IoT MCP Server + REST API + Web Dashboard");
    console.log("============================================================");
    console.log(` Web Dashboard : http://localhost:${CONFIG.port}`);
    console.log(` REST API      : http://localhost:${CONFIG.port}/api/status`);
    console.log(` MCP (SSE)     : http://localhost:${CONFIG.port}/sse`);
    console.log(` MCP (HTTP)    : http://localhost:${CONFIG.port}/mcp`);
    console.log(` MQTT Broker   : ${CONFIG.mqttBrokerUrl}`);
    console.log(
      ` Hardware Mode : ${
        CONFIG.simulateHardware ? "SIMULATION (Fallback Active)" : "REAL HARDWARE (I2C/GPIO)"
      }`
    );
    console.log("============================================================");
  });
}

startServer();

