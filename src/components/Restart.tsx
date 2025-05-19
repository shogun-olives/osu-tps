import { useEffect, useRef, useState, useCallback } from "react";
import type { Settings } from "../types";

interface Props {
	settings: Settings;
	onRestart: () => void;
}

export function HoldToRestart({ settings, onRestart }: Props) {
	const [progress, setProgress] = useState(0);
	const [visible, setVisible] = useState(false);
	const requestRef = useRef<number>(0);
	const startTimeRef = useRef<number | null>(null);
	const isHolding = useRef(false);
	const cooldown = useRef(false); // prevents holding after restart

	const radius = 40;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference * (1 - progress);

	const loop = useCallback(
		(timestamp: number) => {
			if (startTimeRef.current === null) startTimeRef.current = timestamp;
			const elapsed = timestamp - startTimeRef.current;

			const newProgress = Math.min(elapsed / settings.mode.retryHold, 1);
			setProgress(newProgress);

			if (newProgress >= 1) {
				onRestart();
				cooldown.current = true; // block further restart until key is released
				reset();
			} else {
				requestRef.current = requestAnimationFrame(loop);
			}
		},
		[settings.mode.retryHold, onRestart]
	);

	const reset = () => {
		cancelAnimationFrame(requestRef.current!);
		setProgress(0);
		startTimeRef.current = null;
		isHolding.current = false;
		setVisible(false);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key.toLowerCase() === settings.keybinds.retry.toLowerCase() &&
				!isHolding.current &&
				!cooldown.current
			) {
				isHolding.current = true;
				setVisible(true);
				requestRef.current = requestAnimationFrame(loop);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === settings.keybinds.retry.toLowerCase()) {
				cooldown.current = false; // allow restart again
				reset();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [settings.keybinds.retry, loop]);

	return (
		<div
			className={`transition-opacity duration-300 ${
				visible ? "opacity-100" : "opacity-0"
			} relative w-[50px] h-[50px] flex items-center justify-center`}
		>
			{/* Circular progress SVG */}
			<svg className="absolute w-full h-full" viewBox="0 0 100 100">
				<circle
					className="text-gray-700"
					shapeRendering="geometricPrecision"
					stroke="currentColor"
					strokeWidth="4"
					fill="transparent"
					r={radius}
					cx="50"
					cy="50"
					opacity={0.2}
				/>
				<circle
					className="text-white"
					shapeRendering="geometricPrecision"
					stroke="currentColor"
					strokeWidth="6"
					fill="transparent"
					r={radius}
					cx="50"
					cy="50"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					style={{
						transform: "rotate(-90deg)",
						transformOrigin: "center",
						stroke: "rgb(var(--accent-color))",
					}}
				/>
			</svg>

			{/* Restart key label */}
			<span className="text-white font-bold text-lg z-10">
				{settings.keybinds.retry}
			</span>
		</div>
	);
}
