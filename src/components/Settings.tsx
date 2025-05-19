import type { Settings, KeybindSettings, TestMode } from "../types";
import { modes } from "../types";
import { KeyInput } from "./KeyInput";
import { SelectionTabs } from "./SelectionTabs";
import { LabelledInput } from "./LabelledInput";
import { useState } from "react";

interface Props {
	settings: Settings;
	setSettings: (settings: Settings) => void;
	restart: () => void;
}

export default function SettingsMenu({
	settings,
	setSettings,
	restart,
}: Props) {
	const [keybinds, setKeybinds] = useState(settings.keybinds);
	const [modeSettings, setModeSettings] = useState(settings.mode);

	const updateKeybinds = (newBinds: KeybindSettings) => {
		setKeybinds(newBinds);
		setSettings({ ...settings, keybinds: newBinds });
	};

	const updateMode = (mode: TestMode) => {
		const updatedConfig = {
			...modeSettings,
			mode: mode,
		};
		setModeSettings(updatedConfig);
		setSettings({ ...settings, mode: updatedConfig });
	};

	const updateValue = (value: number) => {
		if (modeSettings.mode === "Time") {
			const updatedConfig = {
				...modeSettings,
				duration: value,
			};
			setModeSettings(updatedConfig);
			setSettings({ ...settings, mode: updatedConfig });
		} else {
			const updatedConfig = {
				...modeSettings,
				count: value,
			};
			setModeSettings(updatedConfig);
			setSettings({ ...settings, mode: updatedConfig });
		}
	};

	return (
		<div className="flex flex-col w-full gap-[20px]">
			<h2>Settings</h2>
			<div className="flex flex-col">
				<h3>Keybinds</h3>
				{(Object.keys(keybinds) as (keyof KeybindSettings)[]).map(
					(key) => (
						<LabelledInput name={key} key={key}>
							<KeyInput
								label={key}
								value={keybinds[key]}
								keybinds={keybinds}
								setKeybinds={updateKeybinds}
							/>
						</LabelledInput>
					)
				)}
			</div>
			<div className="flex flex-col">
				<h3>Test</h3>
				<LabelledInput name="Mode">
					<SelectionTabs
						tabs={[...modes]}
						current={modeSettings.mode}
						onTabChange={(tab) => {
							updateMode(tab as TestMode);
							restart();
						}}
					/>
				</LabelledInput>
				<LabelledInput
					name={
						modeSettings.mode === "Time" ? "Duration (s)" : "Inputs"
					}
				>
					<input
						className="text-right"
						type="number"
						value={
							modeSettings.mode === "Time"
								? modeSettings.duration
								: modeSettings.count
						}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === "Escape") {
								(e.target as HTMLInputElement).blur();
							}
						}}
						onChange={(e) => {
							updateValue(parseInt(e.target.value));
						}}
					/>
				</LabelledInput>
			</div>
		</div>
	);
}
