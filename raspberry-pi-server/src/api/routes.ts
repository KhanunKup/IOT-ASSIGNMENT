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
   * Helper function to call Google Gemini API with Function Calling
   * Maps Gemini tool calls directly to our 4 MCP Tools:
   *   1. read_pi_sensors
   *   2. control_pi_devices
   *   3. read_from_mqtt
   *   4. publish_to_mqtt
   */
  async function callGeminiWithTools(userPrompt: string): Promise<{
    reply: string;
    mcpTool?: { name: string; arguments: Record<string, unknown>; result: unknown };
  } | null> {
    if (!CONFIG.geminiApiKey) return null;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.geminiModel}:generateContent?key=${CONFIG.geminiApiKey}`;

    const geminiToolDeclarations = [
      {
        functionDeclarations: [
          {
            name: "read_pi_sensors",
            description:
              "อ่านค่าเซนเซอร์จาก Raspberry Pi 4 (อุณหภูมิและความชื้นจาก SHT31, ระยะทางจาก Ultrasonic HC-SR04, และสถานะไฟ LED บน GPIO 17)",
            parameters: {
              type: "OBJECT",
              properties: {
                sensor: {
                  type: "STRING",
                  enum: ["all", "temperature", "humidity", "distance", "led"],
                  description: "เลือกเซนเซอร์ที่ต้องการอ่านค่า ('all' = ทั้งหมด)",
                },
              },
            },
          },
          {
            name: "control_pi_devices",
            description:
              "สั่งเปิด ปิด หรือสลับสถานะหลอดไฟ LED บนบอร์ด Raspberry Pi 4 (ต่ออยู่ที่ GPIO 17 / Physical Pin 11)",
            parameters: {
              type: "OBJECT",
              properties: {
                device: {
                  type: "STRING",
                  enum: ["led"],
                  description: "อุปกรณ์ที่ต้องการควบคุม ('led')",
                },
                action: {
                  type: "STRING",
                  enum: ["ON", "OFF", "TOGGLE"],
                  description: "คำสั่งเปิด/ปิด/สลับสถานะไฟ",
                },
              },
              required: ["action"],
            },
          },
          {
            name: "read_from_mqtt",
            description:
              "อ่านข้อมูลเซนเซอร์จาก LoRa Node (Arduino UNO R4: เซนเซอร์วัดแสง LM393 LDR บนขา A0/D3 และไฟ LED บนขา D4) หรือข้อมูลจาก MQTT Broker",
            parameters: {
              type: "OBJECT",
              properties: {
                topic: {
                  type: "STRING",
                  description: "Topic ที่ต้องการอ่าน เช่น 'lora/node1/data' หรือ 'all'",
                },
              },
            },
          },
          {
            name: "publish_to_mqtt",
            description:
              "ส่งคำสั่งเปิด/ปิดไฟ LED บนบอร์ด LoRa Node (Pin D4) ผ่าน LoRaWAN Downlink ของ ChirpStack หรือส่งข้อความเข้า MQTT Broker",
            parameters: {
              type: "OBJECT",
              properties: {
                topic: {
                  type: "STRING",
                  description: "Topic เช่น 'lora/node1/control'",
                },
                payload: {
                  type: "STRING",
                  enum: ["ON", "OFF", "TOGGLE"],
                  description: "คำสั่งเปิดหรือปิด ('ON' หรือ 'OFF')",
                },
              },
              required: ["topic", "payload"],
            },
          },
        ],
      },
    ];

    const contents: any[] = [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ];

    const systemInstruction = {
      parts: [
        {
          text: "คุณคือ AI Assistant ประจำระบบ IoT ทำหน้าที่ควบคุมและอ่านค่าเซนเซอร์บน Raspberry Pi 4 และ LoRa Node (Arduino UNO R4) จงเลือกใช้ฟังก์ชัน (Function Call) ที่เหมาะสมกับสิ่งที่ผู้ใช้ต้องการ และตอบกลับด้วยภาษาไทยที่เป็นมิตร สุภาพ และกระชับ",
        },
      ],
    };

    const response1 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction,
        tools: geminiToolDeclarations,
        generationConfig: { temperature: 0.2 },
      }),
    });

    if (!response1.ok) {
      console.warn("[Gemini API Error]:", await response1.text());
      return null;
    }

    const resJson1 = (await response1.json()) as any;
    const candidate = resJson1.candidates?.[0];
    const functionCall = candidate?.content?.parts?.find(
      (p: any) => p.functionCall
    )?.functionCall;

    // กรณีที่ Gemini ต้องการเรียก Tool
    if (functionCall) {
      const toolName = functionCall.name;
      const toolArgs = functionCall.args || {};
      console.log(`[Gemini Function Call]: ${toolName}`, toolArgs);

      const toolResult = await executeMcpTool(toolName, toolArgs);

      // ส่งผลลัพธ์ของ Tool กลับไปให้ Gemini เพื่อสร้างข้อความตอบกลับภาษาธรรมชาติ
      contents.push(candidate.content);
      contents.push({
        role: "function",
        parts: [
          {
            functionResponse: {
              name: toolName,
              response: { output: toolResult },
            },
          },
        ],
      });

      const response2 = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction,
          tools: geminiToolDeclarations,
          generationConfig: { temperature: 0.3 },
        }),
      });

      if (response2.ok) {
        const resJson2 = (await response2.json()) as any;
        const finalReply =
          resJson2.candidates?.[0]?.content?.parts?.[0]?.text || "ดำเนินการเรียบร้อยครับ";
        return {
          reply: finalReply.trim(),
          mcpTool: {
            name: toolName,
            arguments: toolArgs,
            result: toolResult,
          },
        };
      }
    }

    // กรณีที่ Gemini ตอบเป็นข้อความสนทนาทั่วไป
    const textReply = candidate?.content?.parts?.[0]?.text;
    if (textReply) {
      return { reply: textReply.trim() };
    }

    return null;
  }

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
      // 0. หากมีการตั้งค่า GEMINI_API_KEY ให้เรียกใช้ Google Gemini Function Calling ทันที!
      if (CONFIG.geminiApiKey) {
        try {
          const geminiResult = await callGeminiWithTools(rawMsg);
          if (geminiResult) {
            return res.json({
              ok: true,
              query: rawMsg,
              reply: geminiResult.reply,
              mcpTool: geminiResult.mcpTool,
              engine: `Google Gemini (${CONFIG.geminiModel})`,
            });
          }
        } catch (e) {
          console.warn("[Gemini Error Fallback]:", e);
        }
      }

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

