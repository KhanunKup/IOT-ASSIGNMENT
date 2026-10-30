#!/usr/bin/env python3
"""
Robust distance measurement script for HC-SR04 Ultrasonic Sensor on Raspberry Pi (Pi 4 & Pi 5).
Compatible with Raspberry Pi OS Bookworm (lgpio / gpiozero) and Bullseye (RPi.GPIO).

Pins:
  - TRIG: GPIO 23 (Physical Pin 16)
  - ECHO: GPIO 24 (Physical Pin 18 via 1k/2k Ohm Voltage Divider: 5V -> 3.3V)
"""

import sys
import time
import json
import os

trig_pin = int(sys.argv[1]) if len(sys.argv) > 1 else 23
echo_pin = int(sys.argv[2]) if len(sys.argv) > 2 else 24

def measure_with_lgpio(trig: int, echo: int) -> float:
    """Standard method for Raspberry Pi OS Bookworm using lgpio."""
    import lgpio
    h = None
    # Try chip 0 (Pi 4 / Bullseye) or chip 4 (Pi 5)
    for chip_num in [0, 4]:
        try:
            h = lgpio.gpiochip_open(chip_num)
            break
        except Exception:
            continue
    
    if h is None:
        raise RuntimeError("Could not open gpiochip 0 or 4 via lgpio")
    
    try:
        lgpio.gpio_claim_output(h, trig, 0)
        lgpio.gpio_claim_input(h, echo)
        time.sleep(0.03)

        # Send 10µs trigger pulse
        lgpio.gpio_write(h, trig, 1)
        time.sleep(0.00001)
        lgpio.gpio_write(h, trig, 0)

        # Wait for ECHO to start (rise to 1)
        timeout = time.time() + 0.05
        pulse_start = time.time()
        while lgpio.gpio_read(h, echo) == 0:
            pulse_start = time.time()
            if pulse_start > timeout:
                raise TimeoutError("ECHO start timeout: ขา ECHO ไม่ตอบสนอง (ตรวจสอบไฟเลี้ยง 5V และสาย ECHO Pin 18)")

        # Wait for ECHO to end (fall to 0)
        timeout = time.time() + 0.05
        pulse_end = time.time()
        while lgpio.gpio_read(h, echo) == 1:
            pulse_end = time.time()
            if pulse_end > timeout:
                raise TimeoutError("ECHO end timeout")

        pulse_duration = pulse_end - pulse_start
        distance = round(pulse_duration * 17150.0, 2)
        return max(2.0, min(distance, 400.0))
    finally:
        try:
            lgpio.gpiochip_close(h)
        except Exception:
            pass

def measure_with_gpiozero(trig: int, echo: int) -> float:
    """Method using gpiozero with lgpio factory for Bookworm."""
    os.environ["GPIOZERO_PIN_FACTORY"] = "lgpio"
    from gpiozero import DistanceSensor
    sensor = DistanceSensor(echo=echo, trigger=trig, max_distance=4.0)
    time.sleep(0.05)
    dist = round(sensor.distance * 100.0, 2)
    sensor.close()
    return dist

def measure_with_rpi_gpio(trig: int, echo: int) -> float:
    """Legacy method for Bullseye / older kernels."""
    import RPi.GPIO as GPIO
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(trig, GPIO.OUT)
    GPIO.setup(echo, GPIO.IN)

    GPIO.output(trig, False)
    time.sleep(0.03)

    GPIO.output(trig, True)
    time.sleep(0.00001)
    GPIO.output(trig, False)

    timeout = time.time() + 0.05
    pulse_start = time.time()
    while GPIO.input(echo) == 0:
        pulse_start = time.time()
        if pulse_start > timeout:
            raise TimeoutError("ECHO start timeout (RPi.GPIO)")

    pulse_end = time.time()
    timeout = time.time() + 0.05
    while GPIO.input(echo) == 1:
        pulse_end = time.time()
        if pulse_end > timeout:
            raise TimeoutError("ECHO end timeout (RPi.GPIO)")

    pulse_duration = pulse_end - pulse_start
    distance = round(pulse_duration * 17150.0, 2)
    return max(2.0, min(distance, 400.0))

if __name__ == "__main__":
    distance = None
    last_error = None

    # Try methods in order of reliability for modern Raspberry Pi OS
    methods = [
        ("lgpio", measure_with_lgpio),
        ("gpiozero", measure_with_gpiozero),
        ("rpi_gpio", measure_with_rpi_gpio),
    ]

    for name, method in methods:
        try:
            distance = method(trig_pin, echo_pin)
            if distance is not None:
                print(json.dumps({"ok": True, "distance_cm": distance, "method": name}))
                sys.exit(0)
        except Exception as exc:
            last_error = f"{name}: {str(exc)}"

    # If all failed, output JSON with descriptive error and exit 0 so Node can read it cleanly
    print(json.dumps({
        "ok": False,
        "error": last_error or "Unknown error",
        "hint": "กรุณาตรวจสอบว่าต่อ VCC เข้า 5V (Pin 2), TRIG เข้า Pin 16 (GPIO23), ECHO เข้า Pin 18 (GPIO24) และติดตั้ง python3-lgpio (sudo apt install -y python3-lgpio)"
    }))
    sys.exit(0)
