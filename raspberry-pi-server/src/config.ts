import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  port: parseInt(process.env.PORT || "3000", 10),
  simulateHardware:
    process.env.SIMULATE_HARDWARE === "true" || process.platform !== "linux",

  // Raspberry Pi 4 Hardware Pins & Bus
  i2cBusNumber: parseInt(process.env.I2C_BUS_NUMBER || "1", 10),
  sht31Address: parseInt(process.env.SHT31_I2C_ADDRESS || "0x44", 16),
  ledGpioPin: parseInt(process.env.LED_GPIO_PIN || "17", 10), // Physical Pin 11
  ultrasonicTrigPin: parseInt(process.env.ULTRASONIC_TRIG_PIN || "23", 10), // Physical Pin 16
  ultrasonicEchoPin: parseInt(process.env.ULTRASONIC_ECHO_PIN || "24", 10), // Physical Pin 18

  sensorPollIntervalMs: parseInt(
    process.env.SENSOR_POLL_INTERVAL_MS || "5000",
    10
  ),

  // MQTT Broker Configuration
  mqttBrokerUrl: process.env.MQTT_BROKER_URL || "mqtt://lora.kmitl.ac.th:1883",
  mqttUsername: process.env.MQTT_USERNAME || "student_lab_it@kmitl.ac.th",
  mqttPassword: process.env.MQTT_PASSWORD || "ZEMyrt77",
  mqttClientId:
    process.env.MQTT_CLIENT_ID ||
    `rpi4-mcp-iot-${Math.random().toString(16).slice(2, 8)}`,

  // ChirpStack Configuration (https://lora.kmitl.ac.th/)
  chirpstackAppId:
    process.env.CHIRPSTACK_APP_ID || "91665bbd-da0f-486e-908a-a45de5148670",
  chirpstackDevEui: (
    process.env.CHIRPSTACK_DEV_EUI || "d1b2824606880dcd"
  ).toLowerCase(),
  chirpstackDownlinkFPort: parseInt(
    process.env.CHIRPSTACK_DOWNLINK_FPORT || "1",
    10
  ),

  // Standard MQTT Topics matching the Assignment diagram
  topics: {
    piTemperature: "pi/sensor/temperature",
    piHumidity: "pi/sensor/humidity",
    piDistance: "pi/sensor/distance",
    piLed: "pi/device/led",
    loraNode1Data: "lora/node1/data",
    loraNode1Control: "lora/node1/control",
  },
};

