import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";
import { CONFIG } from "../config";
import { systemState } from "../state";

const execFileAsync = promisify(execFile);

export interface UltrasonicReading {
  distanceCm: number;
  simulated: boolean;
}

/**
 * Read distance (cm) from HC-SR04 Ultrasonic Sensor on Raspberry Pi 4
 * Default Pins:
 *   - VCC  -> Pin 2 (5V)
 *   - GND  -> Pin 14 (GND)
 *   - TRIG -> Pin 16 (GPIO 23)
 *   - ECHO -> Pin 18 (GPIO 24) via 1kΩ / 2kΩ Voltage Divider (5V -> 3.3V)
 */
export async function readUltrasonic(): Promise<UltrasonicReading> {
  if (!CONFIG.simulateHardware) {
    try {
      const scriptPath = path.resolve(
        __dirname,
        "../../scripts/read_ultrasonic.py"
      );
      const { stdout, stderr } = await execFileAsync(
        "python3",
        [
          scriptPath,
          String(CONFIG.ultrasonicTrigPin),
          String(CONFIG.ultrasonicEchoPin),
        ],
        { timeout: 3000 }
      );
      const parsed = JSON.parse(stdout.trim());
      if (parsed.ok && typeof parsed.distance_cm === "number") {
        return {
          distanceCm: parsed.distance_cm,
          simulated: false,
        };
      } else if (parsed.error) {
        console.warn(
          `[Ultrasonic] Sensor read warning on TRIG=GPIO${CONFIG.ultrasonicTrigPin}, ECHO=GPIO${CONFIG.ultrasonicEchoPin}:`,
          parsed.error,
          parsed.hint ? `| Hint: ${parsed.hint}` : ""
        );
      }
    } catch (err) {
      console.warn(
        `[Ultrasonic] Hardware read failed on TRIG=GPIO${CONFIG.ultrasonicTrigPin}, ECHO=GPIO${CONFIG.ultrasonicEchoPin}, using simulated fallback:`,
        (err as any).stderr || (err as Error).message
      );
    }
  }

  // Smooth realistic simulation around 20 - 200 cm
  const prevDist = systemState.pi.distanceCm || 120.0;
  const nextDist = Number(
    Math.max(10, Math.min(250, prevDist + (Math.random() - 0.5) * 6.0)).toFixed(
      1
    )
  );

  return {
    distanceCm: nextDist,
    simulated: true,
  };
}

