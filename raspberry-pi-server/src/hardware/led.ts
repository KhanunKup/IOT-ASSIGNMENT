import { execFile } from "child_process";
import fs from "fs";
import { promisify } from "util";
import { CONFIG } from "../config";
import { systemState } from "../state";

const execFileAsync = promisify(execFile);

/**
 * Control LED connected to Raspberry Pi 4
 * Default Pin:
 *   - Anode (+) -> Physical Pin 11 (BCM GPIO 17) via 220Ω resistor
 *   - Cathode (-) -> Physical Pin 9 (GND)
 */
export async function setPiLedState(
  action: "ON" | "OFF" | "TOGGLE"
): Promise<"ON" | "OFF"> {
  const targetState: "ON" | "OFF" =
    action === "TOGGLE"
      ? systemState.pi.ledState === "ON"
        ? "OFF"
        : "ON"
      : action;

  const pin = CONFIG.ledGpioPin;
  const level = targetState === "ON" ? "1" : "0";

  if (!CONFIG.simulateHardware) {
    let applied = false;

    // Strategy 1: Raspberry Pi OS Bookworm `pinctrl` utility (`pinctrl set 17 op dh` / `dl`)
    try {
      const driveFlag = targetState === "ON" ? "dh" : "dl";
      await execFileAsync("pinctrl", ["set", String(pin), "op", driveFlag]);
      applied = true;
    } catch {
      // Fallback to Strategy 2
    }

    // Strategy 2: libgpiod `gpioset` (`gpioset gpiochip0 17=1`)
    if (!applied) {
      try {
        await execFileAsync("gpioset", ["gpiochip0", `${pin}=${level}`]);
        applied = true;
      } catch {
        // Fallback to Strategy 3
      }
    }

    // Strategy 3: Legacy sysfs GPIO (`/sys/class/gpio/gpio17`)
    if (!applied) {
      try {
        const gpioPath = `/sys/class/gpio/gpio${pin}`;
        if (!fs.existsSync(gpioPath)) {
          fs.writeFileSync("/sys/class/gpio/export", String(pin));
        }
        fs.writeFileSync(`${gpioPath}/direction`, "out");
        fs.writeFileSync(`${gpioPath}/value`, level);
        applied = true;
      } catch (err) {
        console.warn(
          `[Pi LED] Could not toggle physical GPIO ${pin}, updating state in software:`,
          (err as Error).message
        );
      }
    }
  }

  systemState.pi.ledState = targetState;
  systemState.pi.updatedAt = new Date().toISOString();
  return targetState;
}

