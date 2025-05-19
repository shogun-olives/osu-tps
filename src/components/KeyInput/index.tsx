import { useEffect, useState } from "react";
import styles from "./KeyInput.module.css";
import type { KeybindSettings } from "../../types";

interface KeyInputProps {
	label: keyof KeybindSettings;
	value: string;
	keybinds: KeybindSettings;
	setKeybinds: (kb: KeybindSettings) => void;
}

export function KeyInput({
	label,
	value,
	keybinds,
	setKeybinds,
}: KeyInputProps) {
	const [isActive, setIsActive] = useState(false);
	const [tempValue, setTempValue] = useState(value);

	// ⬇ Sync local state when parent value changes
	useEffect(() => {
		setTempValue(value);
	}, [value]);

	useEffect(() => {
		if (!isActive) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault();

			if (e.key === "Escape") {
				// Revert to original value on escape
				setTempValue(value);
				setIsActive(false); // Automatically deselect
				// Unfocus the input if it is currently focused
				(document.activeElement as HTMLInputElement)?.blur();
				return;
			}

			const newKey = e.key;
			const existingKey = Object.entries(keybinds).find(([key, v]) => {
				void key;
				return v === newKey;
			});

			const updated = { ...keybinds };

			if (existingKey && existingKey[0] !== label) {
				// Swap keys if another key is already bound
				updated[existingKey[0] as keyof KeybindSettings] = value;
			}

			updated[label] = newKey;
			setKeybinds(updated);
			setTempValue(newKey); // Set the new key
			setIsActive(false); // Automatically deselect
			// Unfocus the input if it is currently focused
			(document.activeElement as HTMLInputElement)?.blur();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, label, value, keybinds, setKeybinds]);

	// Automatically deselect on blur (when the input loses focus)
	const handleBlur = () => {
		setTempValue(value); // Revert if not confirmed
		setIsActive(false); // Automatically deselect
		// Unfocus the input if it is currently focused
		(document.activeElement as HTMLInputElement)?.blur();
	};

	return (
		<input
			type="text"
			readOnly
			value={tempValue}
			className={styles.inputBox}
			onBlur={handleBlur}
			onClick={() => setIsActive(true)}
		/>
	);
}
