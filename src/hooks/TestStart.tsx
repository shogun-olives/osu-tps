import { useEffect, useRef } from "react";
import type { Settings, TestData } from "../types";
import { bpm, ur } from "../logic/stats";

type Params = {
	settings: Settings;
	data: TestData;
	active: boolean;
	complete: boolean;
	onStart: () => void;
	onEnd: () => void;
	setData: (data: TestData) => void;
};

export function useTestInputListener({
	settings,
	data,
	active,
	complete,
	onStart,
	onEnd,
	setData,
}: Params) {
	const startTime = useRef(0);
	const timeoutRef = useRef<number | null>(null);
	const currentData = useRef(data);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (complete) return;

			const key = e.key.toLowerCase();

			if (
				key !== settings.keybinds.k1.toLowerCase() &&
				key !== settings.keybinds.k2.toLowerCase()
			) {
				return;
			}

			const now = performance.now();

			// Start the test on first key press
			if (!active) {
				onStart();
				startTime.current = now;

				// Reset data on test start
				currentData.current = {
					timestamps: [],
					bpms: [],
					ur: 0,
				};

				// Start duration timer if in Time mode
				if (
					settings.mode.mode === "Time" &&
					settings.mode.duration > 0
				) {
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current);
					}
					timeoutRef.current = window.setTimeout(() => {
						onEnd();
					}, settings.mode.duration * 1000);
				}
			}

			const timestamp = now - startTime.current;

			currentData.current = {
				timestamps: [...currentData.current.timestamps, timestamp],
				bpms: [
					...currentData.current.bpms,
					bpm(timestamp, currentData.current.bpms.length),
				],
				ur: ur(currentData.current.timestamps),
			};

			setData(currentData.current);

			// End test if in Count mode and target count reached
			if (
				settings.mode.mode === "Count" &&
				currentData.current.bpms.length >= settings.mode.count
			) {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				onEnd();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [settings, active, complete, onStart, onEnd, setData]);
}
