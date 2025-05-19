export function bpm(ms: number, count: number) {
	if (ms == 0) {
		return 0;
	}
	return ((count / ms) * 60000) / 4;
}

export function std(nums: number[]): number {
	const n = nums.length;
	if (n === 0) return 0;
	const mean = nums.reduce((acc, val) => acc + val, 0) / n;
	const variance = nums.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
	return Math.sqrt(variance);
}

export function ur(tdeltas: number[]): number {
	if (tdeltas.length < 2) {
		return 0;
	}
	return (
		std(
			tdeltas.slice(1).map((val: number, idx: number) => {
				return val - tdeltas[idx];
			})
		) * 10
	);
}
