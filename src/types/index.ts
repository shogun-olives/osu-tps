export const modes = ["Time", "Count"] as const;
export type TestMode = (typeof modes)[number];

export interface KeybindSettings {
	k1: string;
	k2: string;
	retry: string;
}

export interface ModeSettings {
	mode: TestMode;
	duration: number;
	count: number;
	retryHold: number;
}

export interface AestheticSettings {
	theme: string;
}

export type Settings = {
	keybinds: KeybindSettings;
	mode: ModeSettings;
	aesthetic: AestheticSettings;
};

export interface TestData {
	timestamps: number[];
	bpms: number[];
	ur: number;
}

export interface TestResult {
	id: string;
	name: string;
	date: string;
	bpm: number;
	ur: number;
	data: TestData;
}
