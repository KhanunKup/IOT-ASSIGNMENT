"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUltrasonic = readUltrasonic;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const config_1 = require("../config");
const state_1 = require("../state");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
/**
 * Read distance (cm) from HC-SR04 Ultrasonic Sensor on Raspberry Pi 4
 * Default Pins:
 *   - VCC  -> Pin 2 (5V)
 *   - GND  -> Pin 14 (GND)
 *   - TRIG -> Pin 16 (GPIO 23)
 *   - ECHO -> Pin 18 (GPIO 24) via 1kΩ / 2kΩ Voltage Divider (5V -> 3.3V)
 */
async function readUltrasonic() {
    if (!config_1.CONFIG.simulateHardware) {
        try {
            const scriptPath = path_1.default.resolve(__dirname, "../../scripts/read_ultrasonic.py");
            const { stdout } = await execFileAsync("python3", [
                scriptPath,
                String(config_1.CONFIG.ultrasonicTrigPin),
                String(config_1.CONFIG.ultrasonicEchoPin),
            ], { timeout: 2000 });
            const parsed = JSON.parse(stdout.trim());
            if (parsed.ok && typeof parsed.distance_cm === "number") {
                return {
                    distanceCm: parsed.distance_cm,
                    simulated: false,
                };
            }
        }
        catch (err) {
            console.warn(`[Ultrasonic] Hardware read failed on TRIG=GPIO${config_1.CONFIG.ultrasonicTrigPin}, ECHO=GPIO${config_1.CONFIG.ultrasonicEchoPin}, using simulated fallback:`, err.message);
        }
    }
    // Smooth realistic simulation around 20 - 200 cm
    const prevDist = state_1.systemState.pi.distanceCm || 120.0;
    const nextDist = Number(Math.max(10, Math.min(250, prevDist + (Math.random() - 0.5) * 6.0)).toFixed(1));
    return {
        distanceCm: nextDist,
        simulated: true,
    };
}
