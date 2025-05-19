import { useState } from "react";
import type { TestResult } from "../../types";
import styles from "./HistoryItem.module.css";

interface Props {
	test: TestResult;
	onSelect: (test: TestResult) => void;
	onRename: (newName: string) => void;
	onDelete: () => void;
	selected: boolean;
	isEditing: boolean;
	onEditClick: () => void;
	onCancelEdit: () => void;
}

export function HistoryItem({
	test,
	onSelect,
	onRename,
	onDelete,
	selected,
	isEditing,
	onEditClick,
	onCancelEdit,
}: Props) {
	const [name, setName] = useState(test.name);
	const [originalName, setOriginalName] = useState(test.name);

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			onRename(name.trim());
		} else if (e.key === "Escape") {
			setName(originalName);
			onCancelEdit();
		}
	};

	const handleEditClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOriginalName(name);
		onEditClick();
	};

	return (
		<div
			className={`${styles.container} ${
				selected ? styles.selected : styles.unselected
			}`}
			onClick={() => onSelect(test)}
			style={{
				borderColor: selected ? "rgb(var(--accent-color))" : undefined,
			}}
		>
			{/* First Row */}
			<div className="flex justify-between items-center gap-2">
				{isEditing ? (
					<input
						autoFocus
						className={`text-[20px] flex-1 mr-[10px] text-left bg-transparent outline-none ${styles.input}`}
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={handleInputKeyDown}
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<div
						className={`text-[20px] flex-1 mr-[10px] text-left overflow-hidden text-ellipsis whitespace-nowrap ${styles.name}`}
						title={name}
					>
						{name}
					</div>
				)}
				{/* ... edit and delete buttons */}

				{/* Edit Button */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className={styles.icon}
					onClick={handleEditClick}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16.862 3.487a2.1 2.1 0 113.02 2.92L7.123 19.167l-4.09.682.682-4.09L16.862 3.487z"
					/>
				</svg>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className={styles.icon}
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</div>

			{/* Second Row */}
			<div className={`${styles.subtext} mb-[10px]`}>{test.date}</div>

			{/* Stats */}
			<div className="flex justify-between">
				<span className={styles.label}>BPM</span>
				<span className={styles.subtext}>
					{(() => {
						try {
							return test.bpm.toFixed(2);
						} catch {
							return test.bpm;
						}
					})()}
				</span>
			</div>
			<div className="flex justify-between">
				<span className={styles.label}>UR</span>
				<span className={styles.subtext}>
					{(() => {
						try {
							return test.ur.toFixed(2);
						} catch {
							return test.ur;
						}
					})()}
				</span>
			</div>
		</div>
	);
}
