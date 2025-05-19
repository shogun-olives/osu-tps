import { useState } from "react";
import { HistoryItem } from "./HistoryItem";
import type { TestResult } from "../types";

interface Props {
	history: TestResult[];
	setHistory: (history: TestResult[]) => void;
	selectTest: (test: TestResult) => void;
	selectedTest: TestResult | null;
	setSelectedTest: (test: TestResult | null) => void;
	deselectTest: () => void;
}

export default function History({
	history,
	setHistory,
	selectTest,
	selectedTest,
	setSelectedTest,
	deselectTest,
}: Props) {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const handleSelect = (test: TestResult) => {
		setSelectedTest(test);
		selectTest(test);
	};

	const handleRename = (id: string, newName: string) => {
		const newHistory = history.map((item) =>
			item.id === id ? { ...item, name: newName } : item
		);
		setHistory(newHistory);
		setEditingIndex(null);
	};

	const handleDelete = (id: string, index: number) => {
		const newHistory = history.filter((item) => item.id !== id);
		setHistory(newHistory);
		if (selectedTest?.id === id) {
			deselectTest();
		}

		if (editingIndex === index) {
			setEditingIndex(null);
		}
	};

	return (
		<div className="flex flex-col w-full h-full gap-[20px]">
			<h2 className="mb-2">History</h2>
			<div className="flex-1 overflow-y-auto pr-2 custom-scroll">
				<div className="flex flex-col-reverse gap-[15px]">
					{[...history].map((item, index) => (
						<HistoryItem
							key={item.id}
							test={item}
							onSelect={handleSelect}
							onRename={(newName) =>
								handleRename(item.id, newName)
							}
							onDelete={() => handleDelete(item.id, index)}
							selected={selectedTest === item}
							isEditing={editingIndex === index}
							onEditClick={() => setEditingIndex(index)}
							onCancelEdit={() => setEditingIndex(null)} // <-- NEW
						/>
					))}
				</div>
			</div>
		</div>
	);
}
