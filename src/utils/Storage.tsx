import type { Settings, TestResult } from "../types";
import { DfltSettings } from "../types/Defaults";

export function getHistory(): TestResult[] {
	const stored = localStorage.getItem("testData");
	return (stored ? JSON.parse(stored) : []) as TestResult[];
}

export function saveHistory(testData: TestResult[]) {
	localStorage.setItem("testData", JSON.stringify(testData));
}

export function getSettings(): Settings {
	const stored = localStorage.getItem("settings");
	return (stored ? JSON.parse(stored) : DfltSettings) as Settings;
}

export function saveSettings(settings: Settings) {
	localStorage.setItem("settings", JSON.stringify(settings));
}
