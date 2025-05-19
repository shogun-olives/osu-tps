import { CreditRow } from "./CreditRow";
import githubIcon from "../assets/github.svg";
import osuLogo from "../assets/Osu!_Logo_2016.svg";

export function Credits() {
	return (
		<div className="flex flex-col w-full gap-[20px]">
			<h2>Credits</h2>
			<div className="flex flex-col gap-[10px]">
				<CreditRow
					username="shogun-olives"
					src={githubIcon}
					link="https://github.com/shogun-olives/osu-tps"
				/>
				<CreditRow
					username="[olives]"
					src={osuLogo}
					link="https://osu.ppy.sh/users/17097411"
				/>
			</div>
		</div>
	);
}
