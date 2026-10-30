"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountApiRoutes = mountApiRoutes;
const config_1 = require("../config");
const led_1 = require("../hardware/led");
const mqttClient_1 = require("../mqtt/mqttClient");
const state_1 = require("../state");
function mountApiRoutes(app) {
    /**
     * GET /api/status
     * Returns current sensor readings and device states for both Raspberry Pi and LoRa Node
     */
    app.get("/api/status", (_req, res) => {
        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            mqtt: {
                brokerUrl: config_1.CONFIG.mqttBrokerUrl,
                connected: state_1.systemState.mqttConnected,
                chirpstackServer: "https://lora.kmitl.ac.th/",
            },
            pi: {
                ...state_1.systemState.pi,
                pins: {
                    sht31: "I2C1: SDA=GPIO2 (Pin 3), SCL=GPIO3 (Pin 5), Addr=0x44",
                    ultrasonic: "TRIG=GPIO23 (Pin 16), ECHO=GPIO24 (Pin 18)",
                    led: `GPIO${config_1.CONFIG.ledGpioPin} (Pin 11)`,
                },
            },
            loraNode1: {
                ...state_1.systemState.loraNode1,
                pins: {
                    loraShield: "NSS=D10, RST=D9, DIO0=D2, DIO1=D6, SPI=D11/D12/D13",
                    lightLdr: "LM393 4-Pin: AO=Pin A0 (Analog), DO=Pin D5 (Digital Trimpot), GND, VCC=5V",
                    infrared: "Digital D3",
                    led: "Digital D4",
                },
            },
            mcpEndpoints: {
                sse: `/sse`,
                httpJsonRpc: `/mcp`,
            },
        });
    });
    /**
     * GET /api/history
     * Returns time-series data for the Web Dashboard live chart
     */
    app.get("/api/history", (_req, res) => {
        res.json({
            ok: true,
            history: state_1.systemState.history,
        });
    });
    /**
     * POST /api/pi/led
     * Control the LED connected to Raspberry Pi GPIO 17
     * Body: { "action": "ON" | "OFF" | "TOGGLE" }
     */
    app.post("/api/pi/led", async (req, res) => {
        const rawAction = String(req.body?.action || "TOGGLE").toUpperCase();
        const action = rawAction === "ON" || rawAction === "OFF" ? rawAction : "TOGGLE";
        const newState = await (0, led_1.setPiLedState)(action);
        (0, mqttClient_1.publishToMqtt)(config_1.CONFIG.topics.piLed, newState, true);
        res.json({
            ok: true,
            device: "Raspberry Pi LED",
            pin: `GPIO ${config_1.CONFIG.ledGpioPin} (Pin 11)`,
            ledState: newState,
            updatedAt: state_1.systemState.pi.updatedAt,
        });
    });
    /**
     * POST /api/lora/led
     * Send Downlink via MQTT/ChirpStack to control the LED on Arduino UNO R4 (Pin D4)
     * Body: { "action": "ON" | "OFF" | "TOGGLE" }
     */
    app.post("/api/lora/led", (req, res) => {
        const rawAction = String(req.body?.action || "TOGGLE").toUpperCase();
        const action = rawAction === "ON" || rawAction === "OFF" ? rawAction : "TOGGLE";
        const result = (0, mqttClient_1.sendLoRaDownlinkLed)(action);
        res.json({
            ok: true,
            device: "Arduino UNO R4 LoRa Node LED",
            pin: "Digital D4",
            ledState: result.targetState,
            downlinkTopic: result.downlinkTopic,
            base64Payload: result.base64Payload,
            mqttPublished: result.mqttPublished,
            updatedAt: state_1.systemState.loraNode1.updatedAt,
        });
    });
    /**
     * POST /api/simulate/lora
     * Simulate or inject an incoming LoRa Node reading (Light A0 & Infrared D3) for testing
     */
    app.post("/api/simulate/lora", (req, res) => {
        const lightRaw = typeof req.body?.lightRaw === "number"
            ? Math.max(0, Math.min(1023, Math.round(req.body.lightRaw)))
            : Math.floor(300 + Math.random() * 650);
        const lightPercent = Number(((lightRaw / 1023) * 100).toFixed(1));
        const lightDigital = typeof req.body?.lightDigital === "boolean"
            ? req.body.lightDigital
            : lightPercent >= 50;
        const infraredDetected = typeof req.body?.infraredDetected === "boolean"
            ? req.body.infraredDetected
            : !state_1.systemState.loraNode1.infraredDetected;
        state_1.systemState.loraNode1.lightRaw = lightRaw;
        state_1.systemState.loraNode1.lightPercent = lightPercent;
        state_1.systemState.loraNode1.lightDigital = lightDigital;
        state_1.systemState.loraNode1.infraredDetected = infraredDetected;
        state_1.systemState.loraNode1.updatedAt = new Date().toISOString();
        state_1.systemState.recordHistoryPoint();
        (0, mqttClient_1.publishToMqtt)(config_1.CONFIG.topics.loraNode1Data, JSON.stringify(state_1.systemState.loraNode1), true);
        res.json({
            ok: true,
            loraNode1: state_1.systemState.loraNode1,
        });
    });
}
