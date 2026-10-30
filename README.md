# ระบบ IoT ควบคุม/อ่านค่า ผ่าน AI Chat box (MCP Server + LoRaWAN + Web Dashboard)

โปรเจกต์นี้ออกแบบและพัฒนาตามโจทย์ Assignment ครบทั้ง 8 ข้อ โดยใช้:
1. **Raspberry Pi 4** รัน **Node.js + TypeScript** ทำหน้าที่เป็น **MCP Server**, **MQTT Client**, **REST API** และ **Web Dashboard** ในพอร์ตเดียว (`Port 3000`)
2. **Local Devices บน Raspberry Pi 4**:
   - เซนเซอร์วัดอุณหภูมิและความชื้น **SHT31 (I2C)** (แทน DHT22)
   - เซนเซอร์วัดระยะทาง **Ultrasonic HC-SR04 (GPIO)**
   - ไฟ **LED (GPIO)** สำหรับสั่งเปิด/ปิด
3. **LoRa Node บน Arduino UNO R4 + LoRa Shield (SX1276/RFM95)** เชื่อมต่อผ่าน **ChirpStack (`https://lora.kmitl.ac.th/`)**:
   - เซนเซอร์วัดแสง **LDR Module**
   - เซนเซอร์ **Infrared (IR) ตรวจจับวัตถุ**
   - ไฟ **LED บน LoRa Node** สำหรับรับคำสั่งเปิด/ปิดผ่าน LoRa Downlink

---

## 1. ตารางสรุปการต่อสายและพอร์ต (Hardware Pin & Port Mapping)

### 1.1 ฝั่ง Raspberry Pi 4 (Header 40 ขา)

| อุปกรณ์ / เซนเซอร์ | ขาของอุปกรณ์ | ขาบน Raspberry Pi 4 (BCM) | Physical Pin | หมายเหตุ |
| :--- | :--- | :--- | :--- | :--- |
| **SHT31** (Temp & Humidity) | `VCC` | `3.3V` | **Pin 1** | ใช้ไฟเลี้ยง 3.3V |
| **SHT31** | `GND` | `GND` | **Pin 6** | กราวด์ |
| **SHT31** | `SDA` | **GPIO 2 (SDA1)** | **Pin 3** | I2C Bus 1 (Address `0x44`) |
| **SHT31** | `SCL` | **GPIO 3 (SCL1)** | **Pin 5** | I2C Bus 1 |
| **LED** (ไฟควบคุม) | `Anode (+)` | **GPIO 17** | **Pin 11** | ต่อผ่านตัวต้านทาน `220Ω - 330Ω` |
| **LED** | `Cathode (-)` | `GND` | **Pin 9** | กราวด์ |
| **Ultrasonic HC-SR04** | `VCC` | `5V` | **Pin 2** | ใช้ไฟเลี้ยง 5V |
| **Ultrasonic HC-SR04** | `GND` | `GND` | **Pin 14** | กราวด์ |
| **Ultrasonic HC-SR04** | `TRIG` | **GPIO 23** | **Pin 16** | Digital Output |
| **Ultrasonic HC-SR04** | `ECHO` | **GPIO 24** | **Pin 18** | **ผ่านตัวต้านทานแบ่งแรงดัน 1kΩ / 2kΩ (ลด 5V -> 3.3V)** |

### 1.2 ฝั่ง Arduino UNO R4 + LoRa Shield (SX1276/RFM95)

| อุปกรณ์ | ขาของอุปกรณ์ | ขาบน Arduino UNO R4 | ประเภทสัญญาณ / หมายเหตุ |
| :--- | :--- | :--- | :--- |
| **LoRa Shield SX1276** | `NSS / RST / DIO0 / DIO1` | **D10 / D9 / D2 / D6** | ล็อกตามโครงสร้างบอร์ด LoRa Shield (รวม SPI `D11-D13`) |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `AO` (Analog Output) | **Pin A0** | อ่านระดับความสว่างละเอียดแบบ Analog (`0 - 1023` หรือ `0 - 100%`) |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `DO` (Digital Output) | **Pin D5** | ตรวจจับสว่าง/มืดตามเกณฑ์ที่ปรับด้วย Trimpot สีฟ้า (`LOW` = สว่างเกินเกณฑ์, `HIGH` = มืด) |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `GND` | **GND** | กราวด์ร่วม |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `VCC` | **5V** | ไฟเลี้ยง 5V (หรือ 3.3V) |
| **เซนเซอร์ Infrared (IR)** | `DO` / `VCC` / `GND` | **Pin D3** / `5V` / `GND` | อ่านค่าตรวจจับวัตถุแบบ Digital (`LOW = พบวัตถุ`) |
| **ไฟ LED บน LoRa Node** | `Anode (+)` / `Cathode (-)` | **Pin D4** / `GND` | รับคำสั่งเปิด/ปิดผ่าน LoRa Downlink (เลี่ยง `D13` ที่ชนกับ SPI SCK) |

---

## 2. วิธีรันเซิร์ฟเวอร์บน Raspberry Pi 4 (หรือทดสอบบนคอมพิวเตอร์)

```bash
cd raspberry-pi-server
cp .env.example .env
npm install
npm run build
npm start
```

เมื่อรันแล้ว ระบบจะเปิดให้บริการที่พอร์ต `3000`:
- **Web Dashboard**: `http://localhost:3000` (หรือ `http://<IP-ของ-Raspberry-Pi>:3000`)
- **REST API**: `GET /api/status`, `GET /api/history`, `POST /api/pi/led`, `POST /api/lora/led`
- **MCP Server (SSE)**: `http://<IP-ของ-Raspberry-Pi>:3000/sse`
- **MCP Server (HTTP JSON-RPC)**: `http://<IP-ของ-Raspberry-Pi>:3000/mcp`

---

## 3. การเชื่อมต่อ AI Chat box (Claude Desktop / ChatGPT)

### ตัวอย่างการตั้งค่าใน `claude_desktop_config.json` (สำหรับ Claude Desktop)
```json
{
  "mcpServers": {
    "raspberry-pi-iot": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://<IP-ของ-Raspberry-Pi>:3000/sse"
      ]
    }
  }
}
```
*(หรือหากเชื่อมผ่าน ChatGPT Web MCP Connector สามารถรัน `cloudflared tunnel --url http://localhost:3000` บน Raspberry Pi แล้วนำ URL `https://xxxx.trycloudflare.com/sse` ไปใส่ในหน้าตั้งค่า Connector ได้ทันที)*

