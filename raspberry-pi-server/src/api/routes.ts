import { Express, Request, Response } from "express";
import { CONFIG } from "../config";
import { setPiLedState } from "../hardware/led";
import {
  publishToMqtt,
  sendLoRaDownlinkLed,
} from "../mqtt/mqttClient";
import { systemState } from "../state";

export function mountApiRoutes(app: Express): void {
  /**
   * GET /api/status
   * Returns current sensor readings and device states for both Raspberry Pi and LoRa Node
   */
  app.get("/api/status", (_req: Request, res: Response) => {
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      mqtt: {
        brokerUrl: CONFIG.mqttBrokerUrl,
        connected: systemState.mqttConnected,
        chirpstackServer: "https://lora.kmitl.ac.th/",
      },
      pi: {
        ...systemState.pi,
        pins: {
          sht31: "I2C1: SDA=GPIO2 (Pin 3), SCL=GPIO3 (Pin 5), Addr=0x44",
          ultrasonic: "TRIG=GPIO23 (Pin 16), ECHO=GPIO24 (Pin 18)",
          led: `GPIO${CONFIG.ledGpioPin} (Pin 11)`,
        },
      },
      loraNode1: {
        ...systemState.loraNode1,
        pins: {
          loraShield: "NSS=D10, RST=D7, DIO0=D2, DIO1=D5, DIO2=D6, SPI=D11/D12/D13",
          lightLdr: "LM393 4-Pin: AO=Pin A0 (Analog), DO=Pin D3 (Digital Trimpot), GND, VCC=5V",
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
  app.get("/api/history", (_req: Request, res: Response) => {
    res.json({
      ok: true,
      history: systemState.history,
    });
  });

  /**
   * POST /api/pi/led
   * Control the LED connected to Raspberry Pi GPIO 17
   * Body: { "action": "ON" | "OFF" | "TOGGLE" }
   */
  app.post("/api/pi/led", async (req: Request, res: Response) => {
    const rawAction = String(req.body?.action || "TOGGLE").toUpperCase();
    const action: "ON" | "OFF" | "TOGGLE" =
      rawAction === "ON" || rawAction === "OFF" ? rawAction : "TOGGLE";

    const newState = await setPiLedState(action);
    publishToMqtt(CONFIG.topics.piLed, newState, true);

    res.json({
      ok: true,
      device: "Raspberry Pi LED",
      pin: `GPIO ${CONFIG.ledGpioPin} (Pin 11)`,
      ledState: newState,
      updatedAt: systemState.pi.updatedAt,
    });
  });

  /**
   * POST /api/lora/led
   * Send Downlink via MQTT/ChirpStack to control the LED on Arduino UNO R4 (Pin D4)
   * Body: { "action": "ON" | "OFF" | "TOGGLE" }
   */
  app.post("/api/lora/led", (req: Request, res: Response) => {
    const rawAction = String(req.body?.action || "TOGGLE").toUpperCase();
    const action: "ON" | "OFF" | "TOGGLE" =
      rawAction === "ON" || rawAction === "OFF" ? rawAction : "TOGGLE";

    const result = sendLoRaDownlinkLed(action);

    res.json({
      ok: true,
      device: "Arduino UNO R4 LoRa Node LED",
      pin: "Digital D4",
      ledState: result.targetState,
      downlinkTopic: result.downlinkTopic,
      base64Payload: result.base64Payload,
      mqttPublished: result.mqttPublished,
      updatedAt: systemState.loraNode1.updatedAt,
    });
  });

  /**
   * POST /api/simulate/lora
   * Simulate or inject an incoming LoRa Node reading (Light AO & DO) for testing
   */
  app.post("/api/simulate/lora", (req: Request, res: Response) => {
    const lightRaw =
      typeof req.body?.lightRaw === "number"
        ? Math.max(0, Math.min(1023, Math.round(req.body.lightRaw)))
        : Math.floor(300 + Math.random() * 650);
    const lightPercent = Number(((lightRaw / 1023) * 100).toFixed(1));
    const lightDigital =
      typeof req.body?.lightDigital === "boolean"
        ? req.body.lightDigital
        : lightPercent >= 50;

    systemState.loraNode1.lightRaw = lightRaw;
    systemState.loraNode1.lightPercent = lightPercent;
    systemState.loraNode1.lightDigital = lightDigital;
    systemState.loraNode1.updatedAt = new Date().toISOString();

    systemState.recordHistoryPoint();
    publishToMqtt(
      CONFIG.topics.loraNode1Data,
      JSON.stringify(systemState.loraNode1),
      true
    );

    res.json({
      ok: true,
      loraNode1: systemState.loraNode1,
    });
  });
}

