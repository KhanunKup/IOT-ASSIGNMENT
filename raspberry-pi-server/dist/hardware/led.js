"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPiLedState = setPiLedState;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const config_1 = require("../config");
const state_1 = require("../state");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
/**
 * Control LED connected to Raspberry Pi 4
 * Default Pin:
 *   - Anode (+) -> Physical Pin 11 (BCM GPIO 17) via 220Ω resistor
 *   - Cathode (-) -> Physical Pin 9 (GND)
 */
async function setPiLedState(action) {
    const targetState = action === "TOGGLE"
        ? state_1.systemState.pi.ledState === "ON"
            ? "OFF"
            : "ON"
        : action;
    const pin = config_1.CONFIG.ledGpioPin;
    const level = targetState === "ON" ? "1" : "0";
    if (!config_1.CONFIG.simulateHardware) {
        let applied = false;
        // Strategy 1: Raspberry Pi OS Bookworm `pinctrl` utility (`pinctrl set 17 op dh` / `dl`)
        try {
            const driveFlag = targetState === "ON" ? "dh" : "dl";
            await execFileAsync("pinctrl", ["set", String(pin), "op", driveFlag]);
            applied = true;
        }
        catch {
            // Fallback to Strategy 2
        }
        // Strategy 2: libgpiod `gpioset` (`gpioset gpiochip0 17=1`)
        if (!applied) {
            try {
                await execFileAsync("gpioset", ["gpiochip0", `${pin}=${level}`]);
                applied = true;
            }
            catch {
                // Fallback to Strategy 3
            }
        }
        // Strategy 3: Legacy sysfs GPIO (`/sys/class/gpio/gpio17`)
        if (!applied) {
            try {
                const gpioPath = `/sys/class/gpio/gpio${pin}`;
                if (!fs_1.default.existsSync(gpioPath)) {
                    fs_1.default.writeFileSync("/sys/class/gpio/export", String(pin));
                }
                fs_1.default.writeFileSync(`${gpioPath}/direction`, "out");
                fs_1.default.writeFileSync(`${gpioPath}/value`, level);
                applied = true;
            }
            catch (err) {
                console.warn(`[Pi LED] Could not toggle physical GPIO ${pin}, updating state in software:`, err.message);
            }
        }
    }
    state_1.systemState.pi.ledState = targetState;
    state_1.systemState.pi.updatedAt = new Date().toISOString();
    return targetState;
}
