export interface PiSensorData {
  temperature: number; // °C from SHT31 (I2C 0x44, GPIO 2/3)
  humidity: number; // %RH from SHT31 (I2C 0x44, GPIO 2/3)
  distanceCm: number; // cm from Ultrasonic HC-SR04 (TRIG=GPIO 23, ECHO=GPIO 24)
  ledState: "ON" | "OFF"; // LED on GPIO 17
  simulated: boolean;
  updatedAt: string;
}

export interface LoRaNodeData {
  devEui: string;
  deviceName?: string;
  lightRaw: number; // Analog A0 (0 - 1023) from LDR AO
  lightPercent: number; // 0 - 100 %
  lightDigital: boolean; // Digital D5 from LDR DO (true = Bright / เกินเกณฑ์ Trimpot, false = Dark)
  infraredDetected: boolean; // Digital D3 (true = obstacle detected, false = clear)
  ledState: "ON" | "OFF"; // Digital D4 (controlled via LoRa Downlink)
  rssi?: number;
  snr?: number;
  updatedAt: string;
}

export interface HistoryPoint {
  timestamp: string;
  piTemperature: number;
  piHumidity: number;
  piDistanceCm: number;
  loraLightPercent: number;
  loraLightDigital: boolean;
  loraInfraredDetected: boolean;
}

class SystemState {
  public pi: PiSensorData = {
    temperature: 26.5,
    humidity: 62.0,
    distanceCm: 120.0,
    ledState: "OFF",
    simulated: true,
    updatedAt: new Date().toISOString(),
  };

  public loraNode1: LoRaNodeData = {
    devEui: "0000000000000000",
    deviceName: "arduino-r4-lora-node1",
    lightRaw: 680,
    lightPercent: 66.5,
    lightDigital: true,
    infraredDetected: false,
    ledState: "OFF",
    rssi: -78,
    snr: 9.5,
    updatedAt: new Date().toISOString(),
  };

  public mqttConnected: boolean = false;
  public mqttMessagesCache: Record<string, { payload: string; updatedAt: string }> = {};
  public history: HistoryPoint[] = [];
  private readonly maxHistoryLength = 50;

  public recordHistoryPoint(): void {
    this.history.push({
      timestamp: new Date().toISOString(),
      piTemperature: this.pi.temperature,
      piHumidity: this.pi.humidity,
      piDistanceCm: this.pi.distanceCm,
      loraLightPercent: this.loraNode1.lightPercent,
      loraLightDigital: this.loraNode1.lightDigital,
      loraInfraredDetected: this.loraNode1.infraredDetected,
    });

    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }
  }

  public updateMqttCache(topic: string, payload: string): void {
    this.mqttMessagesCache[topic] = {
      payload,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const systemState = new SystemState();
