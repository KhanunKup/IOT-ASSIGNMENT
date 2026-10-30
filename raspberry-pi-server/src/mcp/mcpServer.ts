import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Express, Request, Response } from "express";
import { CONFIG } from "../config";
import { setPiLedState } from "../hardware/led";
import { readSht31 } from "../hardware/sht31";
import { readUltrasonic } from "../hardware/ultrasonic";
import {
  publishPiSensorsToMqtt,
  publishToMqtt,
  sendLoRaDownlinkLed,
} from "../mqtt/mqttClient";
import { systemState } from "../state";

/**
 * Create and configure an MCP Server instance with the 4 required tools from Block 2:
 *   1. read_pi_sensors    (Tool: Read Pi Sensors)
 *   2. control_pi_devices (Tool: Control Pi Devices)
 *   3. read_from_mqtt     (Tool: Read from MQTT)
 *   4. publish_to_mqtt    (Tool: Publish to MQTT)
 */
export function createMcpServerInstance(): Server {
  const server = new Server(
    {
      name: "raspberry-pi-iot-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List the 4 MCP Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "read_pi_sensors",
          description:
            "Tool: Read Pi Sensors — อ่านค่าเซนเซอร์ที่ต่ออยู่บนบอร์ด Raspberry Pi 4 ได้แก่ SHT31 (อุณหภูมิ °C และความชื้น %RH ผ่าน I2C GPIO 2/3), Ultrasonic HC-SR04 (ระยะทาง cm ผ่าน GPIO 23/24) และสถานะไฟ LED (GPIO 17)",
          inputSchema: {
            type: "object",
            properties: {
              sensor: {
                type: "string",
                enum: ["all", "temperature", "humidity", "distance", "led"],
                description:
                  "เลือกเซนเซอร์ที่ต้องการอ่านค่า ('all' = ทั้งหมด, 'temperature' = อุณหภูมิ SHT31, 'humidity' = ความชื้น SHT31, 'distance' = ระยะทาง Ultrasonic, 'led' = สถานะไฟ LED)",
              },
            },
          },
        },
        {
          name: "control_pi_devices",
          description:
            "Tool: Control Pi Devices — สั่งเปิด/ปิดอุปกรณ์ Local Device บน Raspberry Pi 4 (ไฟ LED ที่ขา GPIO 17 / Physical Pin 11) และอัปเดตสถานะเข้า MQTT Broker (pi/device/led)",
          inputSchema: {
            type: "object",
            properties: {
              device: {
                type: "string",
                enum: ["led"],
                description: "อุปกรณ์ที่ต้องการควบคุมบน Raspberry Pi ('led')",
              },
              action: {
                type: "string",
                enum: ["ON", "OFF", "TOGGLE"],
                description:
                  "คำสั่งควบคุม: 'ON' (เปิดไฟ), 'OFF' (ปิดไฟ), หรือ 'TOGGLE' (สลับสถานะ)",
              },
            },
            required: ["action"],
          },
        },
        {
          name: "read_from_mqtt",
          description:
            "Tool: Read from MQTT — อ่านค่าข้อมูลจาก MQTT Broker รวมถึงค่าจาก LoRa Node (Arduino UNO R4: เซนเซอร์วัดแสง LDR ขา A0, เซนเซอร์ Infrared ตรวจจับวัตถุขา D3, และสถานะไฟ LED ขา D4 บน topic 'lora/node1/data') หรือค่าจาก topic ของ Raspberry Pi",
          inputSchema: {
            type: "object",
            properties: {
              topic: {
                type: "string",
                description:
                  "ระบุ MQTT Topic ที่ต้องการอ่าน เช่น 'lora/node1/data', 'pi/sensor/temperature', 'pi/sensor/humidity', 'pi/device/led', หรือใส่ 'all' เพื่อดูข้อมูลทั้งหมด",
              },
            },
          },
        },
        {
          name: "publish_to_mqtt",
          description:
            "Tool: Publish to MQTT — ส่งคำสั่งหรือข้อมูลไปยัง MQTT Broker เช่น สั่งเปิด/ปิดไฟ LED บน LoRa Node (Arduino UNO R4 ขา D4) ผ่าน ChirpStack Downlink หรือส่งข้อความไปยัง topic ที่ระบุ",
          inputSchema: {
            type: "object",
            properties: {
              topic: {
                type: "string",
                description:
                  "MQTT Topic ปลายทาง เช่น 'lora/node1/control' (สำหรับสั่งเปิด/ปิดไฟบน LoRa Node), 'pi/device/led', หรือ topic อื่นๆ",
              },
              payload: {
                type: "string",
                description:
                  "ข้อมูลหรือคำสั่งที่ต้องการส่ง เช่น 'ON', 'OFF', 'TOGGLE' หรือ JSON string",
              },
            },
            required: ["topic", "payload"],
          },
        },
      ],
    };
  });

  // Handle Tool Execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const result = await executeMcpTool(name, (args || {}) as Record<string, unknown>);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  });

  return server;
}

/**
 * Shared Tool Execution Logic used by both SSE Transport and HTTP JSON-RPC
 */
export async function executeMcpTool(
  name: string,
  args: Record<string, unknown>
): Promise<Record<string, unknown>> {
  switch (name) {
    case "read_pi_sensors": {
      const sensorFilter = (args.sensor as string) || "all";

      // Refresh live readings from SHT31 & Ultrasonic
      const [sht, ultra] = await Promise.all([readSht31(), readUltrasonic()]);
      systemState.pi.temperature = sht.temperature;
      systemState.pi.humidity = sht.humidity;
      systemState.pi.distanceCm = ultra.distanceCm;
      systemState.pi.simulated = sht.simulated && ultra.simulated;
      systemState.pi.updatedAt = new Date().toISOString();

      publishPiSensorsToMqtt();

      const pinMapping = {
        sht31: "I2C1 (SDA=GPIO2/Pin3, SCL=GPIO3/Pin5, Addr=0x44)",
        ultrasonic: "HC-SR04 (TRIG=GPIO23/Pin16, ECHO=GPIO24/Pin18)",
        led: "GPIO17 (Physical Pin 11)",
      };

      if (sensorFilter === "temperature") {
        return {
          sensor: "SHT31 Temperature",
          temperature_c: systemState.pi.temperature,
          unit: "°C",
          port: pinMapping.sht31,
          updatedAt: systemState.pi.updatedAt,
        };
      }
      if (sensorFilter === "humidity") {
        return {
          sensor: "SHT31 Humidity",
          humidity_rh: systemState.pi.humidity,
          unit: "%RH",
          port: pinMapping.sht31,
          updatedAt: systemState.pi.updatedAt,
        };
      }
      if (sensorFilter === "distance") {
        return {
          sensor: "Ultrasonic HC-SR04",
          distance_cm: systemState.pi.distanceCm,
          unit: "cm",
          port: pinMapping.ultrasonic,
          updatedAt: systemState.pi.updatedAt,
        };
      }
      if (sensorFilter === "led") {
        return {
          device: "Raspberry Pi LED",
          led_state: systemState.pi.ledState,
          port: pinMapping.led,
          updatedAt: systemState.pi.updatedAt,
        };
      }

      return {
        board: "Raspberry Pi 4",
        temperature_c: systemState.pi.temperature,
        humidity_rh: systemState.pi.humidity,
        distance_cm: systemState.pi.distanceCm,
        led_state: systemState.pi.ledState,
        simulated: systemState.pi.simulated,
        ports: pinMapping,
        dashboard_url: `http://localhost:${CONFIG.port}`,
        updatedAt: systemState.pi.updatedAt,
      };
    }

    case "control_pi_devices": {
      const rawAction = String(args.action || "TOGGLE").toUpperCase();
      const action: "ON" | "OFF" | "TOGGLE" =
        rawAction === "ON" || rawAction === "OFF" ? rawAction : "TOGGLE";

      const newState = await setPiLedState(action);
      publishToMqtt(CONFIG.topics.piLed, newState, true);

      return {
        success: true,
        device: "Raspberry Pi LED",
        pin: `GPIO ${CONFIG.ledGpioPin} (Physical Pin 11)`,
        previous_action: action,
        current_state: newState,
        mqtt_topic: CONFIG.topics.piLed,
        updatedAt: systemState.pi.updatedAt,
      };
    }

    case "read_from_mqtt": {
      const topic = String(args.topic || "all").trim();

      if (
        topic === "lora/node1/data" ||
        topic.toLowerCase().includes("lora")
      ) {
        return {
          topic: CONFIG.topics.loraNode1Data,
          chirpstack_server: "https://lora.kmitl.ac.th/",
          board: "Arduino UNO R4 + LoRa SX1276/RFM95 Shield",
          lora_node_data: {
            devEui: systemState.loraNode1.devEui,
            deviceName: systemState.loraNode1.deviceName,
            light_raw_a0: systemState.loraNode1.lightRaw,
            light_percent: systemState.loraNode1.lightPercent,
            infrared_obstacle_detected_d3:
              systemState.loraNode1.infraredDetected,
            infrared_status_text: systemState.loraNode1.infraredDetected
              ? "ตรวจพบวัตถุ (Obstacle Detected)"
              : "ปกติ ไม่พบวัตถุ (Clear)",
            led_state_d4: systemState.loraNode1.ledState,
            rssi_dbm: systemState.loraNode1.rssi,
            snr_db: systemState.loraNode1.snr,
            updatedAt: systemState.loraNode1.updatedAt,
          },
          ports: {
            lora_shield: "NSS=D10, RST=D9, DIO0=D2, DIO1=D6, SPI=D11/D12/D13",
            light_sensor_ldr: "Analog Pin A0",
            infrared_sensor: "Digital Pin D3",
            lora_node_led: "Digital Pin D4",
          },
        };
      }

      if (topic !== "all" && systemState.mqttMessagesCache[topic]) {
        return {
          topic,
          mqtt_connected: systemState.mqttConnected,
          data: systemState.mqttMessagesCache[topic],
        };
      }

      return {
        mqtt_broker: CONFIG.mqttBrokerUrl,
        mqtt_connected: systemState.mqttConnected,
        pi_topics: {
          [CONFIG.topics.piTemperature]: `${systemState.pi.temperature} °C`,
          [CONFIG.topics.piHumidity]: `${systemState.pi.humidity} %RH`,
          [CONFIG.topics.piDistance]: `${systemState.pi.distanceCm} cm`,
          [CONFIG.topics.piLed]: systemState.pi.ledState,
        },
        lora_topics: {
          [CONFIG.topics.loraNode1Data]: {
            light_raw: systemState.loraNode1.lightRaw,
            light_percent: `${systemState.loraNode1.lightPercent}%`,
            infrared_detected: systemState.loraNode1.infraredDetected,
            led_state: systemState.loraNode1.ledState,
            rssi: systemState.loraNode1.rssi,
            snr: systemState.loraNode1.snr,
            updatedAt: systemState.loraNode1.updatedAt,
          },
        },
        cached_topics: systemState.mqttMessagesCache,
      };
    }

    case "publish_to_mqtt": {
      const topic = String(args.topic || "").trim();
      const payload = String(args.payload ?? "").trim();

      if (!topic) {
        throw new Error("Topic is required for publish_to_mqtt");
      }

      // Check if user is controlling the LoRa Node LED
      if (
        topic === CONFIG.topics.loraNode1Control ||
        topic === CONFIG.topics.loraNode1Data ||
        topic.includes("lora")
      ) {
        const upper = payload.toUpperCase();
        if (upper === "ON" || upper === "OFF" || upper === "TOGGLE") {
          const dl = sendLoRaDownlinkLed(upper);
          return {
            success: true,
            target: "Arduino UNO R4 LoRa Node LED (Pin D4)",
            led_state: dl.targetState,
            chirpstack_downlink_topic: dl.downlinkTopic,
            base64_payload: dl.base64Payload,
            mqtt_published: dl.mqttPublished,
          };
        }
      }

      // Check if user is controlling the Raspberry Pi LED via MQTT
      if (topic === CONFIG.topics.piLed) {
        const upper = payload.toUpperCase();
        if (upper === "ON" || upper === "OFF" || upper === "TOGGLE") {
          const newState = await setPiLedState(upper);
          const published = publishToMqtt(CONFIG.topics.piLed, newState, true);
          return {
            success: true,
            target: "Raspberry Pi LED (GPIO 17)",
            topic: CONFIG.topics.piLed,
            led_state: newState,
            mqtt_published: published,
          };
        }
      }

      const published = publishToMqtt(topic, payload);
      return {
        success: true,
        topic,
        payload,
        mqtt_connected: systemState.mqttConnected,
        mqtt_published: published,
      };
    }

    default:
      throw new Error(`Unknown MCP tool: ${name}`);
  }
}

// Keep active SSE transports mapped by sessionId
const activeSseTransports = new Map<string, SSEServerTransport>();

/**
 * Mount MCP Endpoints onto Express:
 *   - GET  /sse       (SSE connection endpoint for Claude Desktop / ChatGPT / MCP Inspector)
 *   - POST /messages  (SSE message receiver)
 *   - POST /mcp       (Stateless JSON-RPC over HTTP endpoint matching diagram "MCP (HTTP/JSON)")
 */
export function mountMcpRoutes(app: Express): void {
  // 1. SSE Transport Endpoints
  app.get("/sse", async (_req: Request, res: Response) => {
    console.log("[MCP] New SSE client connected");
    const transport = new SSEServerTransport("/messages", res);
    const mcpServer = createMcpServerInstance();

    activeSseTransports.set(transport.sessionId, transport);
    res.on("close", () => {
      activeSseTransports.delete(transport.sessionId);
    });

    await mcpServer.connect(transport);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport =
      activeSseTransports.get(sessionId) ||
      Array.from(activeSseTransports.values())[0];

    if (!transport) {
      res.status(400).json({ error: "No active MCP SSE session found" });
      return;
    }

    await transport.handlePostMessage(req, res, req.body);
  });

  // 2. Direct JSON-RPC 2.0 over HTTP (`POST /mcp`) for Streamable HTTP / Direct JSON clients
  app.post("/mcp", async (req: Request, res: Response) => {
    const body = req.body;
    const id = body?.id ?? null;
    const method = body?.method;

    try {
      if (method === "initialize") {
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: {
              name: "raspberry-pi-iot-mcp-server",
              version: "1.0.0",
            },
          },
        });
        return;
      }

      if (method === "notifications/initialized") {
        res.status(200).json({ jsonrpc: "2.0", id, result: {} });
        return;
      }

      if (method === "tools/list") {
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "read_pi_sensors",
                description:
                  "อ่านค่าเซนเซอร์จาก Raspberry Pi 4: SHT31 (Temp & Humidity), Ultrasonic HC-SR04 (Distance) และสถานะ LED",
                inputSchema: {
                  type: "object",
                  properties: {
                    sensor: {
                      type: "string",
                      enum: ["all", "temperature", "humidity", "distance", "led"],
                    },
                  },
                },
              },
              {
                name: "control_pi_devices",
                description:
                  "สั่งเปิด/ปิดไฟ LED บนบอร์ด Raspberry Pi 4 (GPIO 17 / Pin 11)",
                inputSchema: {
                  type: "object",
                  properties: {
                    device: { type: "string", enum: ["led"] },
                    action: { type: "string", enum: ["ON", "OFF", "TOGGLE"] },
                  },
                  required: ["action"],
                },
              },
              {
                name: "read_from_mqtt",
                description:
                  "อ่านค่าจาก MQTT Broker รวมถึงค่าเซนเซอร์วัดแสง (LDR A0) และ Infrared (D3) จาก Arduino UNO R4 LoRa Node",
                inputSchema: {
                  type: "object",
                  properties: {
                    topic: { type: "string" },
                  },
                },
              },
              {
                name: "publish_to_mqtt",
                description:
                  "ส่งข้อมูลหรือคำสั่งไปยัง MQTT Broker เช่น สั่งเปิด/ปิดไฟ LED ขา D4 บน LoRa Node ผ่าน ChirpStack Downlink",
                inputSchema: {
                  type: "object",
                  properties: {
                    topic: { type: "string" },
                    payload: { type: "string" },
                  },
                  required: ["topic", "payload"],
                },
              },
            ],
          },
        });
        return;
      }

      if (method === "tools/call") {
        const toolName = body.params?.name;
        const toolArgs = body.params?.arguments || {};
        const output = await executeMcpTool(toolName, toolArgs);
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(output, null, 2),
              },
            ],
          },
        });
        return;
      }

      res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      });
    } catch (err) {
      res.status(500).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32000, message: (err as Error).message },
      });
    }
  });
}

