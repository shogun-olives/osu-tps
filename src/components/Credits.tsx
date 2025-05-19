import { CreditRow } from "./CreditRow";

export function Credits() {
	return (
		<div className="flex flex-col w-full gap-[20px]">
			<h2>Credits</h2>
			<div className="flex flex-col gap-[10px]">
				<CreditRow
					username="shogun-olives"
					src="/src/assets/github.svg"
					link="https://github.com/shogun-olives/osu-tps"
				/>
				<CreditRow
					username="[olives]"
					src="/src/assets/Osu!_Logo_2016.svg"
					link="https://osu.ppy.sh/users/17097411"
				/>
			</div>
		</div>
	);
}
