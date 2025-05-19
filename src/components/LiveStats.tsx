import { useEffect, useState, useRef } from "react";
import { bpm, ur } from "../logic/stats";
import type { TestData } from "../types";

interface Props {
	active: boolean;
	dfltBPM?: number;
	dfltUR?: number;
	data: TestData;
}

export function Stats({ active, dfltBPM = 0, dfltUR = 0, data }: Props) {
	const [elapsed, setElapsed] = useState(0);
	const startTimeRef = useRef<number | null>(null);
	const animationFrameId = useRef<number | null>(null);

	useEffect(() => {
		if (active) {
			// When active starts: record start time
			startTimeRef.current = performance.now();

			// Update elapsed time every animation frame for smoothness & accuracy
			const update = () => {
				if (startTimeRef.current !== null) {
					setElapsed(performance.now() - startTimeRef.current);
					animationFrameId.current = requestAnimationFrame(update);
				}
			};
			animationFrameId.current = requestAnimationFrame(update);
		} else {
			// When active stops: cancel animation and keep elapsed time frozen
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
				animationFrameId.current = null;
			}
			startTimeRef.current = null;
		}

		// Cleanup on unmount or active change
		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [active]);

	return (
		<div className="flex flex-col">
			<div className="min-w-[120px] flex items-center">
				<span>bpm</span>
				<span className="flex-grow min-w-[10px]" />
				<span className="opacity-70">
					{(active
						? bpm(elapsed, data.bpms.length)
						: dfltBPM
					).toFixed(2)}
				</span>
			</div>
			<div className="min-w-[120px] flex items-center">
				<span>ur</span>
				<span className="flex-grow min-w-[10px]" />
				<span className="opacity-70">
					{(active ? ur(data.timestamps) : dfltUR).toFixed(2)}
				</span>
			</div>
		</div>
	);
}
