#!/usr/bin/env python3
"""
Helper script to measure distance (cm) from HC-SR04 Ultrasonic Sensor on Raspberry Pi 4.
Default BCM Pins:
  - TRIG: GPIO 23 (Physical Pin 16)
  - ECHO: GPIO 24 (Physical Pin 18) -> Must use 1k/2k Ohm voltage divider (5V -> 3.3V)
Outputs JSON: {"distance_cm": 45.2}
"""
import sys
import time
import json

trig_pin = int(sys.argv[1]) if len(sys.argv) > 1 else 23
echo_pin = int(sys.argv[2]) if len(sys.argv) > 2 else 24

def measure_with_rpi_gpio(trig: int, echo: int) -> float:
    import RPi.GPIO as GPIO
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(trig, GPIO.OUT)
    GPIO.setup(echo, GPIO.IN)

    GPIO.output(trig, False)
    time.sleep(0.02)

    # Send 10us pulse to TRIG
    GPIO.output(trig, True)
    time.sleep(0.00001)
    GPIO.output(trig, False)

    timeout = time.time() + 0.04  # 40ms timeout (~680cm max)
    pulse_start = time.time()
    while GPIO.input(echo) == 0:
        pulse_start = time.time()
        if pulse_start > timeout:
            raise TimeoutError("ECHO pulse start timeout")

    pulse_end = time.time()
    timeout = time.time() + 0.04
    while GPIO.input(echo) == 1:
        pulse_end = time.time()
        if pulse_end > timeout:
            raise TimeoutError("ECHO pulse end timeout")

    pulse_duration = pulse_end - pulse_start
    # Speed of sound ~ 34300 cm/s -> distance = (duration * 34300) / 2
    distance = round(pulse_duration * 17150.0, 2)
    return max(2.0, min(distance, 400.0))

def measure_with_gpiozero(trig: int, echo: int) -> float:
    from gpiozero import DistanceSensor
    sensor = DistanceSensor(echo=echo, trigger=trig, max_distance=4.0)
    distance_cm = round(sensor.distance * 100.0, 2)
    sensor.close()
    return distance_cm

if __name__ == "__main__":
    try:
        try:
            dist = measure_with_rpi_gpio(trig_pin, echo_pin)
        except ImportError:
            dist = measure_with_gpiozero(trig_pin, echo_pin)
        print(json.dumps({"ok": True, "distance_cm": dist}))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        sys.exit(1)

