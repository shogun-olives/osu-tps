import { useEffect, useRef } from "react";
import type { TestData } from "../types";

interface Props {
	data: TestData;
}

export function Graph({ data }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<any>(null);

	useEffect(() => {
		if (!window.CanvasJS || !containerRef.current) return;

		// Create chart once on mount
		if (!chartRef.current) {
			chartRef.current = new window.CanvasJS.Chart(containerRef.current, {
				backgroundColor: "transparent",
				animationEnabled: true,
				axisX: {
					title: "Time (s)",
					labelFontColor: "white",
					lineColor: "white",
					tickColor: "white",
				},
				axisY: {
					title: "bpm",
					labelFontColor: "white",
					minimum: Math.min(...data.bpms.slice(2)) - 10,
					maximum: Math.max(...data.bpms.slice(2)) + 10,
				},
				data: [
					{
						type: "spline",
						dataPoints: data.bpms.slice(2).map((bpm, i) => ({
							x: data.timestamps[i + 2] / 1000,
							y: bpm,
						})),
					},
				],
			});
			chartRef.current.render();
		} else {
			// Update chart options on data change
			const minBpm = Math.min(...data.bpms.slice(2)) - 10;
			const maxBpm = Math.max(...data.bpms.slice(2)) + 10;

			chartRef.current.options.axisY.minimum = minBpm;
			chartRef.current.options.axisY.maximum = maxBpm;
			chartRef.current.options.data[0].dataPoints = data.bpms
				.slice(2)
				.map((bpm, i) => ({
					x: data.timestamps[i + 2] / 1000,
					y: bpm,
				}));
			chartRef.current.render();
		}
	}, [data]);

	return (
		<div ref={containerRef} style={{ width: "100%", height: "400px" }} />
	);
}
