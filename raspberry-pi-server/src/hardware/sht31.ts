import { CONFIG } from "../config";
import { systemState } from "../state";

export interface Sht31Reading {
  temperature: number;
  humidity: number;
  simulated: boolean;
}

/**
 * Verify SHT31 CRC-8 checksum (polynomial 0x31, initialization 0xFF)
 */
function verifyCrc8(data: number[], expectedCrc: number): boolean {
  let crc = 0xff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x80) !== 0) {
        crc = ((crc << 1) ^ 0x31) & 0xff;
      } else {
        crc = (crc << 1) & 0xff;
      }
    }
  }
  return crc === expectedCrc;
}

/**
 * Read Temperature (°C) and Relative Humidity (%RH) from SHT31 via I2C Bus 1
 * Pins on Raspberry Pi 4:
 *   - VCC -> Pin 1 (3.3V)
 *   - SDA -> Pin 3 (GPIO 2 / SDA1)
 *   - SCL -> Pin 5 (GPIO 3 / SCL1)
 *   - GND -> Pin 6 (GND)
 */
export async function readSht31(): Promise<Sht31Reading> {
  if (!CONFIG.simulateHardware) {
    try {
      // Dynamic import so Windows/macOS development machines don't fail if i2c-bus isn't compiled
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const i2c = require("i2c-bus");
      const bus = await i2c.openPromisified(CONFIG.i2cBusNumber);
      try {
        // Send High Repeatability Measurement Command (Clock Stretching Disabled): 0x24, 0x00
        const cmdBuf = Buffer.from([0x24, 0x00]);
        await bus.i2cWrite(CONFIG.sht31Address, cmdBuf.length, cmdBuf);

        // Wait 20ms for SHT31 measurement to complete (datasheet max is 15.5ms)
        await new Promise((resolve) => setTimeout(resolve, 20));

        // Read 6 bytes: [Temp MSB, Temp LSB, Temp CRC, Hum MSB, Hum LSB, Hum CRC]
        const readBuf = Buffer.alloc(6);
        await bus.i2cRead(CONFIG.sht31Address, readBuf.length, readBuf);

        const tempValid = verifyCrc8([readBuf[0], readBuf[1]], readBuf[2]);
        const humValid = verifyCrc8([readBuf[3], readBuf[4]], readBuf[5]);

        if (!tempValid || !humValid) {
          throw new Error("SHT31 CRC-8 checksum mismatch");
        }

        const rawTemp = (readBuf[0] << 8) | readBuf[1];
        const rawHum = (readBuf[3] << 8) | readBuf[4];

        const temperature = Number(
          (-45.0 + (175.0 * rawTemp) / 65535.0).toFixed(2)
        );
        const humidity = Number(((100.0 * rawHum) / 65535.0).toFixed(2));

        return { temperature, humidity, simulated: false };
      } finally {
        await bus.close();
      }
    } catch (err) {
      // Fall back to simulated values if sensor is temporarily disconnected
      console.warn(
        `[SHT31] Hardware read failed on I2C-${CONFIG.i2cBusNumber} (0x${CONFIG.sht31Address.toString(16)}), using simulated fallback:`,
        (err as Error).message
      );
    }
  }

  // Smooth realistic simulation around current value
  const prevTemp = systemState.pi.temperature || 26.5;
  const prevHum = systemState.pi.humidity || 62.0;
  const nextTemp = Number(
    Math.max(20, Math.min(38, prevTemp + (Math.random() - 0.5) * 0.4)).toFixed(
      1
    )
  );
  const nextHum = Number(
    Math.max(35, Math.min(90, prevHum + (Math.random() - 0.5) * 1.2)).toFixed(1)
  );

  return {
    temperature: nextTemp,
    humidity: nextHum,
    simulated: true,
  };
}

