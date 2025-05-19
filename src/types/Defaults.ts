import type { TestMode } from "./index";

export const DfltSettings = {
	keybinds: {
		k1: "z",
		k2: "x",
		retry: "r",
	},
	mode: {
		mode: "Count" as TestMode,
		count: 30,
		duration: 5,
		retryHold: 250,
	},
	aesthetic: {
		theme: "dark",
	},
};
