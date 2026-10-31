import { Express, Request, Response } from "express";
import { CONFIG } from "../config";
import { setPiLedState } from "../hardware/led";
import { executeMcpTool } from "../mcp/mcpServer";
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

  /**
   * POST /api/chat
   * AI Chat Box endpoint for natural language queries connecting to MCP Tools
   * Body: { message: string }
   */
  app.post("/api/chat", async (req: Request, res: Response) => {
    const rawMsg = String(req.body?.message || "").trim();
    const msg = rawMsg.toLowerCase();

    let toolName = "";
    let toolArgs: Record<string, unknown> = {};
    let friendlyReply = "";

    try {
      // 1. Control Pi LED (เปิด/ปิดไฟห้องเรียน หรือบอร์ด Pi)
      if (
        msg.includes("เปิดไฟ") &&
        !msg.includes("lora") &&
        !msg.includes("node")
      ) {
        toolName = "control_pi_devices";
        toolArgs = { device: "led", action: "ON" };
        const result = await executeMcpTool(toolName, toolArgs);
        friendlyReply = `💡 สั่งเปิดไฟ LED บน Raspberry Pi เรียบร้อยแล้วครับ (GPIO 17 / Physical Pin 11)`;
        return res.json({
          ok: true,
          query: rawMsg,
          reply: friendlyReply,
          mcpTool: { name: toolName, arguments: toolArgs, result },
        });
      }

      if (
        msg.includes("ปิดไฟ") &&
        !msg.includes("lora") &&
        !msg.includes("node")
      ) {
        toolName = "control_pi_devices";
        toolArgs = { device: "led", action: "OFF" };
        const result = await executeMcpTool(toolName, toolArgs);
        friendlyReply = `🌑 สั่งปิดไฟ LED บน Raspberry Pi เรียบร้อยแล้วครับ (GPIO 17)`;
        return res.json({
          ok: true,
          query: rawMsg,
          reply: friendlyReply,
          mcpTool: { name: toolName, arguments: toolArgs, result },
        });
      }

      // 2. Control LoRa Node LED (เปิด/ปิดไฟ LoRa Node ขา D4 ผ่าน Downlink)
      if (
        msg.includes("เปิดไฟ") &&
        (msg.includes("lora") || msg.includes("node"))
      ) {
        toolName = "publish_to_mqtt";
        toolArgs = { topic: CONFIG.topics.loraNode1Control, payload: "ON" };
        const result = await executeMcpTool(toolName, toolArgs);
        friendlyReply = `📡 ส่งคำสั่ง LoRa Downlink สั่งเปิดไฟ LED บนบอร์ด LoRa Node (Pin D4) ผ่าน ChirpStack เรียบร้อยแล้วครับ`;
        return res.json({
          ok: true,
          query: rawMsg,
          reply: friendlyReply,
          mcpTool: { name: toolName, arguments: toolArgs, result },
        });
      }

      if (
        msg.includes("ปิดไฟ") &&
        (msg.includes("lora") || msg.includes("node"))
      ) {
        toolName = "publish_to_mqtt";
        toolArgs = { topic: CONFIG.topics.loraNode1Control, payload: "OFF" };
        const result = await executeMcpTool(toolName, toolArgs);
        friendlyReply = `📡 ส่งคำสั่ง LoRa Downlink สั่งปิดไฟ LED บนบอร์ด LoRa Node (Pin D4) ผ่าน ChirpStack เรียบร้อยแล้วครับ`;
        return res.json({
          ok: true,
          query: rawMsg,
          reply: friendlyReply,
          mcpTool: { name: toolName, arguments: toolArgs, result },
        });
      }

      // 3. Read Temperature
      if (msg.includes("อุณหภูมิ") || msg.includes("temp")) {
        toolName = "read_pi_sensors";
        toolArgs = { sensor: "temperature" };
        const result = (await executeMcpTool(toolName, toolArgs)) as any;
        friendlyReply = `🌡️ อุณหภูมิปัจจุบันจากเซนเซอร์ SHT31 (I2C 0x44) คือ ${result.temperature_c} °C ครับ`;
        return res.json({
          ok: true,
          query: rawMsg,
          reply: friendlyReply,
          mcpTool: { name: toolName, arguments: toolArgs, result },
        });
      }

      // 4. Read Humidity
      if (msg.includes("ความชื้น") || msg.includes("hum")) {
        if (msg.includes("lora") || msg.includes("node")) {
          toolName = "read_from_mqtt";
          toolArgs = { topic: CONFIG.topics.loraNode1Data };
          const result = (await executeMcpTool(toolName, toolArgs)) as any;
          friendlyReply = `🌾 ข้อมูลจาก LoRa Node: ระดับแสง ${result.lora_node_data?.light_percent}% (Raw: ${result.lora_node_data?.light_raw_a0}/1023, สถานะ: ${result.lora_node_data?.light_status}) และไฟ LED: ${result.lora_node_data?.led_state_d4 ? "ON" : "OFF"} ครับ`;
          return res.json({
            ok: true,
            query: rawMsg,
            reply: friendlyReply,
            mcpTool: { name: toolName, arguments: toolArgs, result },
          });
        } else {
          toolName = "read_pi_sensors";
          toolArgs = { sensor: "humidity" };
          const result = (await executeMcpTool(toolName, toolArgs)) as any;
          friendlyReply = `💧 ความชื้นสัมพัทธ์ปัจจุบันจากเซนเซอร์ SHT31 (I2C 0x44) คือ ${result.humidity_rh} %RH ครับ`;
          return res.json({
            ok: true,
            query: rawMsg,
            reply: friendlyReply,
            mcpTool: { name: toolName, arguments: toolArgs, result },
          });
        }
      }

      // 5. Read Distance / Ultrasonic
      if (
        msg.includes("ระยะ") ||
        msg.includes("distance") ||
        msg.includes("ultra")
      ) {
        toolName = "read_pi_sensors";
        toolArgs = { sensor: "distance" };
        const result = (await executeMcpTool(toolName, toolArgs)) as any;
        friendlyReply = `📏 ระยะทางที่วัดได้จาก Ultrasonic HC-SR04 (GPIO 23/24) คือ ${result.distance_cm} ซม. ครับ`;
        return res.json({
          ok: true,
          query: rawMsg,
          reply: friendlyReply,
          mcpTool: { name: toolName, arguments: toolArgs, result },
        });
      }

      // 6. Read LoRa Node / Light
      if (
        msg.includes("lora") ||
        msg.includes("แสง") ||
        msg.includes("node") ||
        msg.includes("ldr")
      ) {
        toolName = "read_from_mqtt";
        toolArgs = { topic: CONFIG.topics.loraNode1Data };
        const result = (await executeMcpTool(toolName, toolArgs)) as any;
        friendlyReply = `☀️ ข้อมูลจาก LoRa Node: แสงสว่าง ${result.lora_node_data?.light_percent}% (Raw: ${result.lora_node_data?.light_raw_a0}), เกณฑ์ Trimpot: ${result.lora_node_data?.light_status}, ไฟ LED ขา D4: ${result.lora_node_data?.led_state_d4 ? "ON" : "OFF"}`;
        return res.json({
          ok: true,
          query: rawMsg,
          reply: friendlyReply,
          mcpTool: { name: toolName, arguments: toolArgs, result },
        });
      }

      // 7. General Status / All Sensors / Dashboard
      toolName = "read_pi_sensors";
      toolArgs = { sensor: "all" };
      const result = (await executeMcpTool(toolName, toolArgs)) as any;
      friendlyReply = `📊 ข้อมูลระบบ IoT ปัจจุบัน:\n• อุณหภูมิ: ${result.temperature_c} °C\n• ความชื้น: ${result.humidity_rh} %RH\n• ระยะทาง: ${result.distance_cm} ซม.\n• สถานะไฟ Pi LED: ${result.led_state ? "ON" : "OFF"}`;
      return res.json({
        ok: true,
        query: rawMsg,
        reply: friendlyReply,
        mcpTool: { name: toolName, arguments: toolArgs, result },
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: (err as Error).message,
      });
    }
  });
}

