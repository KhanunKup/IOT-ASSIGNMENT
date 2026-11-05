#!/bin/bash
# ==============================================================================
# Script สำหรับเปิด Public HTTPS Tunnel (tunnl.gg) สำหรับ Raspberry Pi MCP Server
# ==============================================================================
# ข้อดีของ tunnl.gg:
#  - ไม่ต้องติดตั้งโปรแกรมเพิ่ม (ใช้คำสั่ง ssh ที่มีอยู่แล้วบน Raspberry Pi)
#  - ไม่ต้องสมัครบัญชี หรือกรอก Token
#  - ได้ URL แบบ HTTPS ที่มี SSL ถูกต้องทันที
#  - รองรับ SSE (Server-Sent Events) และ WebSocket สำหรับ MCP Protocol อย่างสมบูรณ์
# ==============================================================================

PORT="${PORT:-3000}"
MODE="${1:-random}" # "random" หรือ "stable"

echo "============================================================"
echo " Starting tunnl.gg Proxy for Raspberry Pi IoT MCP Server"
echo " Local Target: http://localhost:${PORT}"
echo "============================================================"

if [ "$MODE" = "stable" ]; then
    echo "[Mode] STABLE URL (สร้าง URL ถาวรผูกกับ SSH Key ของบอร์ด Pi)"
    echo "คำสั่ง: ssh -o StrictHostKeyChecking=accept-new -t -R 80:localhost:${PORT} stable@proxy.tunnl.gg"
    echo "------------------------------------------------------------"
    ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -t -R "80:localhost:${PORT}" stable@proxy.tunnl.gg
else
    echo "[Mode] RANDOM URL (สร้าง URL สาธารณะแบบสุ่มทันที)"
    echo "คำสั่ง: ssh -o StrictHostKeyChecking=accept-new -t -R 80:localhost:${PORT} proxy.tunnl.gg"
    echo "------------------------------------------------------------"
    ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -t -R "80:localhost:${PORT}" proxy.tunnl.gg
fi
