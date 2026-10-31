# ระบบ IoT ควบคุม/อ่านค่า ผ่าน AI Chat box (MCP Server + LoRaWAN + Web Dashboard)

ระบบนี้ออกแบบและพัฒนาตามโจทย์ Assignment ครบทั้ง 8 ข้อ:
1. **AI Chat box** (Claude Desktop / ChatGPT) สั่งงานผ่าน **MCP Protocol**
2. **Raspberry Pi 4** ทำหน้าที่เป็น **MCP Server** (Node.js / TypeScript รันที่ `Port 3000`)
3. **Local Devices บน Raspberry Pi 4**:
   - เซนเซอร์วัดอุณหภูมิและความชื้น **SHT31 (I2C Address 0x44)** (ปรับปรุงจาก DHT22)
   - เซนเซอร์วัดระยะทาง **Ultrasonic HC-SR04 (GPIO 23/24)**
   - ไฟ **LED บน Raspberry Pi (GPIO 17)**
4. **MQTT Broker**: เชื่อมต่อผ่าน Broker กลาง (เช่น `lora.kmitl.ac.th:1883`)
5. **LoRa Node**: **Arduino UNO R4 + LoRa Shield (SX1276/RFM95)**:
   - โมดูลวัดแสง **LM393 LDR (4 ขา: AO=A0, DO=D3, GND, VCC=5V)**
   - ไฟ **LED บน LoRa Node (Pin D4)** สำหรับรับคำสั่ง Downlink เปิด/ปิดไฟ
6. **LoRa Network Server**: เชื่อมต่อเข้า **ChirpStack (`https://lora.kmitl.ac.th/`)**
7. **Web Dashboard**: หน้าเว็บแสดงผลแบบ Live Data พร้อมปุ่มสวิตช์ควบคุม เชื่อมต่อกับ Raspberry Pi ด้วย **HTTP REST API**

---

## 1. ตารางสรุปการต่อสายฮาร์ดแวร์ (Hardware Pin Mapping)

### 1.1 ฝั่ง Raspberry Pi 4 (บอร์ด 40 ขา)

| อุปกรณ์ / เซนเซอร์ | ขาบนตัวอุปกรณ์ | ขาบน Raspberry Pi (BCM) | Physical Pin | หน้าที่ / วงจรที่ต้องต่อ |
| :--- | :--- | :--- | :--- | :--- |
| **SHT31** (Temp & Hum) | `VCC` | `3.3V Power` | **Pin 1** | ใช้ไฟ 3.3V เท่านั้น |
| **SHT31** | `GND` | `Ground` | **Pin 6** | กราวด์ร่วม |
| **SHT31** | `SDA` | **GPIO 2 (SDA1)** | **Pin 3** | I2C Data (Address `0x44`) |
| **SHT31** | `SCL` | **GPIO 3 (SCL1)** | **Pin 5** | I2C Clock |
| **LED ควบคุม** | `Anode (+)` | **GPIO 17** | **Pin 11** | ต่ออนุกรมตัวต้านทาน `220Ω` - `330Ω` |
| **LED ควบคุม** | `Cathode (-)` | `Ground` | **Pin 9** | กราวด์ร่วม |
| **Ultrasonic HC-SR04** | `VCC` | `5V Power` | **Pin 2** | ไฟเลี้ยง 5V |
| **Ultrasonic HC-SR04** | `GND` | `Ground` | **Pin 14** | กราวด์ร่วม |
| **Ultrasonic HC-SR04** | `TRIG` | **GPIO 23** | **Pin 16** | Digital Output (ส่งพัลส์ 10µs) |
| **Ultrasonic HC-SR04** | `ECHO` | **GPIO 24** | **Pin 18** | **ต้องต่อตัวต้านทานแบ่งแรงดัน (ลด 5V เหลือ 3.3V)** |

> [!WARNING]
> **การต่อวงจรแบ่งแรงดัน (Voltage Divider) สำหรับ Ultrasonic HC-SR04:**
> ขา `ECHO` จ่ายแรงดัน 5V ออกมา แต่ Raspberry Pi รับแรงดันได้ 3.3V
> - ต่อตัวต้านทาน **1kΩ** จากขา `ECHO` ไปที่ **GPIO 24 (Pin 18)**
> - ต่อตัวต้านทาน **2kΩ** จาก **GPIO 24 (Pin 18)** ลง **GND (Pin 14 หรือ Pin 20)**

---

### 1.2 ฝั่ง Arduino UNO R4 + LoRa Shield (SX1276/RFM95)

เสียบ LoRa Shield ทับบน Arduino UNO R4 โดยตรง จากนั้นต่ออุปกรณ์เข้ากับขา Header ด้านบนของ Shield:

| อุปกรณ์ | ขาของอุปกรณ์ | ขาบน Arduino UNO R4 | ประเภทสัญญาณ / หน้าที่ |
| :--- | :--- | :--- | :--- |
| **LoRa Shield (SX1276)** | `NSS / RST / DIO0 / DIO1 / DIO2` | **D10 / D7 / D2 / D5 / D6** | สื่อสาร LoRaWAN (และ SPI `D11-D13`) |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `AO` (Analog Output) | **Pin A0** | อ่านระดับความสว่างละเอียดแบบ Analog (`0 - 1023` หรือ `0 - 100%`) |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `DO` (Digital Output) | **Pin D3** | ตัดต่อสถานะสว่าง/มืดตามเกณฑ์ Trimpot *(ย้ายจาก D5 มา D3 เพื่อไม่ให้ชนกับ DIO1 ของ Shield)* |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `GND` | **Pin GND** | กราวด์ |
| **โมดูลวัดแสง LM393 LDR (4 ขา)** | `VCC` | **Pin 5V** | ไฟเลี้ยง 5V |
| **ไฟ LED บน LoRa Node** | `Anode (+)` | **Pin D4** | ต่อผ่านตัวต้านทาน `220Ω` สำหรับรับคำสั่ง Downlink เปิด/ปิดไฟ |
| **ไฟ LED บน LoRa Node** | `Cathode (-)` | **Pin GND** | กราวด์ร่วม *(ไม่ใช้ D13 เพราะชนกับ SPI SCK ของ LoRa)* |

---

## 2. ขั้นตอนการทดสอบเชื่อมต่อและลงโค้ดบน Arduino UNO R4

1. **เปิด Arduino IDE** บนคอมพิวเตอร์
2. **ติดตั้งไลบรารี MCCI LoRaWAN LMIC library**:
   - ไปที่ `Sketch` -> `Include Library` -> `Manage Libraries...`
   - ค้นหา **"MCCI LoRaWAN LMIC library"** (โดย Terry Moore, MCCI) แล้วกด **Install**
   - *(ตรวจสอบว่าความถี่ใน lmic_project_config.h ตั้งค่าเป็น CFG_as923 ตามที่ใช้ในแล็บ)*
3. **เปิดไฟล์โค้ด**:
   - เปิดไฟล์ `arduino-r4-lora-node/arduino-r4-lora-node.ino`
   - โค้ดนี้ใส่ค่า APPEUI, DEVEUI, APPKEY ของ ChirpStack (`lora.kmitl.ac.th`) และ Pin Map (`NSS=10, RST=7, DIO={2,5,6}`) เรียบร้อยแล้ว
4. **โหมดทดสอบการเชื่อมต่อ (Connection Test)**:
   - ในไฟล์บรรทัดที่ 24 จะตั้งค่าไว้ล่วงหน้า:
     ```cpp
     const bool TEST_MODE_ONLY = true;
     ```
   - ในโหมดนี้ บอร์ดจะส่งเฉพาะข้อความ `"Hello ChirpStack"` ขึ้นไป เพื่อให้ทดสอบได้ทันทีโดยไม่ต้องต่อเซนเซอร์ก่อน
5. **อัปโหลด**:
   - เสียบสาย USB เข้า Arduino UNO R4
   - เลือก Port ให้ตรง แล้วกดปุ่ม **Upload**
   - เปิด **Serial Monitor (Baud rate: 115200)** จะเห็นข้อความ:
     - `EV_JOINING: กำลังส่ง Join-Request ไปยัง ChirpStack...`
     - เมื่อต่อติดจะขึ้น `EV_JOINED: เชื่อมต่อ ChirpStack สำเร็จแล้ว!`
     - จากนั้นเข้าดูที่เว็บ `https://lora.kmitl.ac.th/` -> Device `LoRaWan` -> แท็บ **Live Device Data** จะเห็นแพ็กเกจขึ้นมาทันที!
6. **สลับไปโหมดเซนเซอร์จริง (เมื่อ Join สำเร็จแล้ว)**:
   - นำเซนเซอร์ LDR มาต่อตามตารางด้านบน (`AO` -> `A0`, `DO` -> `D3`, `VCC` -> `5V`, `GND` -> `GND`)
   - แก้ไขบรรทัดที่ 24 เป็น:
     ```cpp
     const bool TEST_MODE_ONLY = false;
     ```
   - กด Upload ใหม่อีกครั้ง ระบบจะส่งค่าเซนเซอร์ 4 Bytes ขึ้น ChirpStack ทุก 15 วินาที

---

## 3. ขั้นตอนการนำโค้ดไปลงบน Raspberry Pi 4

### วิธีที่ 1: คัดลอกโฟลเดอร์ผ่านคำสั่ง SCP (จากเครื่องคอมพิวเตอร์ของคุณ)
เปิด Terminal หรือ PowerShell บนคอมพิวเตอร์ แล้วรันคำสั่ง (แทนที่ `pi` และ `192.168.x.x` ด้วย user และ IP ของ Raspberry Pi):
```bash
scp -r "c:\Users\khanu\Desktop\Assignment\YEAR3\IOT-ASSIGNMENT\raspberry-pi-server" pi@192.168.x.x:~/raspberry-pi-server
```

*(หรือจะใช้ Flash Drive เสียบก๊อปปี้โฟลเดอร์ `raspberry-pi-server` ไปวางที่ Home Directory `~/` บน Raspberry Pi โดยตรงก็ได้)*

---

### ขั้นตอนการติดตั้งและรันบน Raspberry Pi 4 (ผ่านหน้าจอ Pi หรือ SSH)

1. **เปิดการใช้งาน I2C บน Raspberry Pi**:
   ```bash
   sudo raspi-config
   ```
   - เลือก `Interface Options` -> เลือก `I2C` -> เลือก `Yes` เพื่อ Enable
   - กด Finish แล้วสั่งรีบูต 1 ครั้ง: `sudo reboot`

2. **ติดตั้ง Node.js 18+ และเครื่องมือที่จำเป็น** (หากยังไม่มี):
   ```bash
   # ตรวจสอบเวอร์ชัน node
   node -v
   # หากยังไม่มี ให้ติดตั้ง Node.js LTS:
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs python3 python3-pip
   ```

3. **เข้าไปที่โฟลเดอร์โปรเจกต์และติดตั้งแพ็กเกจ**:
   ```bash
   cd ~/raspberry-pi-server
   npm install
   ```

4. **ตั้งค่าไฟล์สภาพแวดล้อม (`.env`)**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   - ตรวจสอบ `MQTT_BROKER_URL` (เช่น `mqtt://lora.kmitl.ac.th:1883`)
   - กรอก `CHIRPSTACK_APP_ID` และ `CHIRPSTACK_DEV_EUI` ให้ตรงกับ Device บนเว็บ ChirpStack
   - กำหนด `SIMULATE_HARDWARE=false` เพื่อให้อ่านค่าจากเซนเซอร์ SHT31, HC-SR04 และสั่ง LED จริง
   - กด `Ctrl + O` แล้ว `Enter` เพื่อบันทึก และ `Ctrl + X` เพื่อออก

5. **บิลด์และเริ่มรันเซิร์ฟเวอร์**:
   ```bash
   npm run build
   npm start
   ```
   เมื่อเซิร์ฟเวอร์เริ่มทำงาน จะแสดงข้อความยืนยัน:
   ```text
   ============================================================
    Raspberry Pi 4 IoT MCP Server + REST API + Web Dashboard
   ============================================================
    Web Dashboard : http://localhost:3000
    REST API      : http://localhost:3000/api/status
    MCP (SSE)     : http://localhost:3000/sse
    MCP (HTTP)    : http://localhost:3000/mcp
    MQTT Broker   : mqtt://lora.kmitl.ac.th:1883
    Hardware Mode : REAL HARDWARE (I2C/GPIO)
   ============================================================
   ```

---

## 4. ขั้นตอนการทดสอบระบบทีละขั้นตอน (Step-by-Step Testing Guide)

### สเต็ปที่ 1: ทดสอบฮาร์ดแวร์บน Raspberry Pi 4 โดยตรง
1. **ทดสอบ SHT31 (I2C)**:
   ```bash
   sudo apt install -y i2c-tools
   sudo i2cdetect -y 1
   ```
   *ผลลัพธ์ที่ถูกต้อง*: ต้องเห็นเลข **`44`** (หรือ `45`) ปรากฏบนตาราง I2C Bus 1
2. **ทดสอบไฟ LED บน Pi (GPIO 17)**:
   ```bash
   pinctrl set 17 op dh    # ไฟ LED บน Pin 11 ต้องติดสว่าง
   pinctrl set 17 op dl    # ไฟ LED บน Pin 11 ต้องดับ
   ```
3. **ทดสอบ Ultrasonic HC-SR04 (GPIO 23/24)**:
   ```bash
   python3 scripts/read_ultrasonic.py 23 24
   ```
   *ผลลัพธ์ที่ถูกต้อง*: จะได้ JSON เช่น `{"ok": true, "distance_cm": 42.5}`

---

### สเต็ปที่ 2: ทดสอบ Arduino UNO R4 + LoRaWAN
1. เปิด **Serial Monitor** ใน Arduino IDE ที่ 115200 baud
2. สังเกตข้อความ `[LoRaWAN] Joined successfully!`
3. เมื่อบอร์ดอ่านค่าเซนเซอร์ จะแสดง:
   ```text
   [Sensors] Light AO(A0)=640 | Light DO(D5)=BRIGHT | LED(D4)=OFF
   [LoRaWAN] Uplink transmitted successfully.
   ```
4. บนหน้าเว็บ `https://lora.kmitl.ac.th/` ในแท็บ **Live Device Data** จะเห็นแพ็กเกจ Uplink 4 ไบต์เข้ามาอย่างต่อเนื่อง

---

### สเต็ปที่ 3: ทดสอบ Web Dashboard
1. เปิดเบราว์เซอร์บนคอมพิวเตอร์หรือโทรศัพท์ที่อยู่ในวง WiFi เดียวกับ Pi ไปที่:
   ```text
   http://<IP-ของ-Raspberry-Pi>:3000
   ```
2. **ตรวจสอบค่า**:
   - การ์ด Raspberry Pi: อุณหภูมิ, ความชื้นจาก SHT31 และระยะทาง Ultrasonic ต้องขึ้นค่าตรงตามของจริง
   - การ์ด LoRa Node: แสดงค่าความสว่าง % และสถานะ `DO(D5): สว่าง / มืด`
   - กราฟ Live Data วาดเส้นอัปเดตแบบเรียลไทม์
3. **ทดสอบสั่งงาน**:
   - กดปุ่ม **เปิดไฟ (ON)** / **ปิดไฟ (OFF)** ฝั่ง Raspberry Pi -> ไฟ LED ที่ Pin 11 ต้องติด/ดับตาม
   - กดปุ่ม **เปิดไฟ (ON)** ฝั่ง LoRa Node -> ระบบจะส่ง Downlink ผ่าน ChirpStack ไปยัง Arduino R4 และไฟ LED ที่ขา Pin D4 ของ Arduino จะติดสว่าง

---

### สเต็ปที่ 4: เชื่อมต่อ AI Chat box เข้ากับ MCP Server บน Raspberry Pi

สามารถนำไปต่อกับ **Claude Desktop** หรือ **ChatGPT** ได้ทันที:

#### สำหรับ Claude Desktop:
เพิ่มการตั้งค่าในไฟล์ `claude_desktop_config.json`:
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

#### สำหรับ ChatGPT Web หรือเข้าถึงจากภายนอกบ้าน:
รัน Cloudflare Tunnel ฟรีบน Raspberry Pi:
```bash
cloudflared tunnel --url http://localhost:3000
```
นำ URL ที่ได้ (เช่น `https://xxxx.trycloudflare.com/sse`) ไปใส่ใน MCP Connector ของ ChatGPT

#### ตัวอย่างคำสั่งที่ใช้พิมพ์ทดสอบกับ AI Chat box:
- *"อุณหภูมิและความชื้นในห้องตอนนี้เท่าไหร่"* -> AI จะเรียก `read_pi_sensors` อ่านค่าจาก SHT31
- *"เปิดไฟที่ห้องเรียนหน่อย"* -> AI จะเรียก `control_pi_devices` สั่งเปิด LED ขา GPIO 17
- *"ขอดูค่าความเข้มแสงจาก LoRa node"* -> AI จะเรียก `read_from_mqtt` ดึงค่าแสงจาก Arduino R4
- *"สั่งเปิดไฟ LED บน LoRa Node ผ่าน MQTT ให้หน่อย"* -> AI จะเรียก `publish_to_mqtt` ส่ง Downlink ไปที่บอร์ด Arduino R4
