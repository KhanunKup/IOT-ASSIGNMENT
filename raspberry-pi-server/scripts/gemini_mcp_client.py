#!/usr/bin/env python3
"""
ตัวอย่างสคริปต์เชื่อมต่อ Google Gemini API กับ Raspberry Pi MCP Server
รองรับทั้ง:
  1. การรันบนแล็ปท็อปเพื่อควบคุม Raspberry Pi จากระยะไกล
  2. การใช้ Google Gemini (gemini-1.5-flash / gemini-2.0-flash) เพื่อแปลคำสั่งภาษาไทย
     และเรียกใช้ MCP Tools บนบอร์ด Raspberry Pi (SHT31, HC-SR04, LED, LoRa Node)

การติดตั้งไลบรารีที่จำเป็น:
  pip install requests
"""

import os
import sys
import json
import requests

# กำหนดค่าการเชื่อมต่อ
PI_SERVER_URL = os.environ.get("PI_SERVER_URL", "http://localhost:3000")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# 4 MCP Tools ที่เปิดให้ Gemini เรียกใช้
GEMINI_TOOLS = [
    {
        "function_declarations": [
            {
                "name": "read_pi_sensors",
                "description": "อ่านค่าเซนเซอร์จาก Raspberry Pi 4 ได้แก่ SHT31 (อุณหภูมิ °C และความชื้น %RH), Ultrasonic HC-SR04 (ระยะทาง cm), และสถานะไฟ LED บน GPIO 17",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "sensor": {
                            "type": "STRING",
                            "enum": ["all", "temperature", "humidity", "distance", "led"],
                            "description": "เลือกเซนเซอร์ที่ต้องการ ('all' = ทั้งหมด)"
                        }
                    }
                }
            },
            {
                "name": "control_pi_devices",
                "description": "สั่งเปิด หรือ ปิดไฟ LED บนบอร์ด Raspberry Pi 4 (ต่ออยู่ที่ขา GPIO 17 / Pin 11)",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "device": {"type": "STRING", "enum": ["led"]},
                        "action": {
                            "type": "STRING",
                            "enum": ["ON", "OFF", "TOGGLE"],
                            "description": "คำสั่ง 'ON' (เปิด), 'OFF' (ปิด), 'TOGGLE' (สลับ)"
                        }
                    },
                    "required": ["action"]
                }
            },
            {
                "name": "read_from_mqtt",
                "description": "อ่านค่าเซนเซอร์จาก LoRa Node (Arduino UNO R4: แสง LDR ขา A0/D3 และไฟ LED ขา D4) จาก MQTT Broker",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "topic": {"type": "STRING", "description": "MQTT Topic เช่น 'lora/node1/data' หรือ 'all'"}
                    }
                }
            },
            {
                "name": "publish_to_mqtt",
                "description": "ส่งคำสั่งเปิด/ปิดไฟ LED บนบอร์ด LoRa Node (Pin D4) ผ่าน LoRaWAN Downlink ของ ChirpStack",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "topic": {"type": "STRING", "description": "เช่น 'lora/node1/control'"},
                        "payload": {"type": "STRING", "enum": ["ON", "OFF", "TOGGLE"]}
                    },
                    "required": ["topic", "payload"]
                }
            }
        ]
    }
]

def execute_tool_on_pi(tool_name: str, args: dict) -> dict:
    """ส่งคำสั่งไปรัน Tool บน Raspberry Pi ผ่าน JSON-RPC Endpoint (/mcp)"""
    url = f"{PI_SERVER_URL}/mcp"
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": args
        }
    }
    try:
        res = requests.post(url, json=payload, timeout=5)
        res.raise_for_status()
        data = res.json()
        raw_text = data.get("result", {}).get("content", [{}])[0].get("text", "{}")
        return json.loads(raw_text)
    except Exception as e:
        return {"error": str(e)}

def chat_with_gemini(user_query: str):
    """ส่งคำสั่งให้ Google Gemini ประมวลผลและเรียกใช้ Tool"""
    if not GEMINI_API_KEY:
        print("[ข้อควรทราบ] ไม่ได้ตั้งค่า GEMINI_API_KEY ส่งคำสั่งไปที่ /api/chat บน Pi โดยตรง...")
        res = requests.post(f"{PI_SERVER_URL}/api/chat", json={"message": user_query})
        data = res.json()
        print(f"\n[AI]: {data.get('reply')}")
        if data.get("mcpTool"):
            print(f"[Tool Call]: {json.dumps(data.get('mcpTool'), indent=2, ensure_ascii=False)}")
        return

    # เรียกใช้ Gemini REST API
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    contents = [{"role": "user", "parts": [{"text": user_query}]}]
    system_instruction = {
        "parts": [{
            "text": "คุณคือ AI Assistant ประจำระบบ IoT ควบคุม Raspberry Pi 4 และ LoRa Node ให้ตอบเป็นภาษาไทยสุภาพและเลือกใช้ Tool ตามความเหมาะสม"
        }]
    }

    body = {
        "contents": contents,
        "systemInstruction": system_instruction,
        "tools": GEMINI_TOOLS
    }

    res1 = requests.post(api_url, json=body).json()
    candidate = res1.get("candidates", [{}])[0]
    parts = candidate.get("content", {}).get("parts", [])

    # ตรวจสอบว่า Gemini ต้องการเรียกใช้ Tool หรือไม่
    func_call = next((p.get("functionCall") for p in parts if "functionCall" in p), None)
    
    if func_call:
        tool_name = func_call["name"]
        tool_args = func_call.get("args", {})
        print(f"\n⚡ [Gemini Function Call] เรียก Tool: {tool_name} พารามิเตอร์: {tool_args}")
        
        # รัน Tool จริงบน Raspberry Pi
        tool_result = execute_tool_on_pi(tool_name, tool_args)
        print(f"📥 [Hardware Output]: {json.dumps(tool_result, ensure_ascii=False)}")

        # ส่งผลลัพธ์กลับไปให้ Gemini สรุปคำตอบภาษาธรรมชาติ
        contents.append(candidate["content"])
        contents.append({
            "role": "function",
            "parts": [{
                "functionResponse": {
                    "name": tool_name,
                    "response": {"output": tool_result}
                }
            }]
        })

        res2 = requests.post(api_url, json={
            "contents": contents,
            "systemInstruction": system_instruction,
            "tools": GEMINI_TOOLS
        }).json()
        
        reply_text = res2["candidates"][0]["content"]["parts"][0]["text"]
        print(f"\n🤖 [AI Gemini]: {reply_text.strip()}\n")
    else:
        reply_text = parts[0].get("text", "ไม่มีคำตอบ")
        print(f"\n🤖 [AI Gemini]: {reply_text.strip()}\n")

if __name__ == "__main__":
    print("=" * 60)
    print("  Google Gemini AI Client เชื่อมต่อ Raspberry Pi MCP Tools")
    print(f"  เป้าหมายเซิร์ฟเวอร์ : {PI_SERVER_URL}")
    print("=" * 60)
    print("ตัวอย่างคำสั่งที่สามารถพิมพ์ได้:")
    print("  1. 'เปิดไฟที่ห้องเรียนหน่อย'")
    print("  2. 'อุณหภูมิและความชื้นตอนนี้เท่าไหร่'")
    print("  3. 'วัดระยะทางให้หน่อย'")
    print("  4. 'ขอดูค่าแสงจาก LoRa node'")
    print("  5. 'สั่งเปิดไฟบน LoRa node'")
    print("  (พิมพ์ 'exit' หรือ 'quit' เพื่อออก)\n")

    while True:
        try:
            q = input("You > ").strip()
            if not q:
                continue
            if q.lower() in ["exit", "quit", "q"]:
                break
            chat_with_gemini(q)
        except KeyboardInterrupt:
            break
