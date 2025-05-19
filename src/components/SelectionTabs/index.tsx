import { useState } from "react";
import styles from "./SelectionTabs.module.css";

interface Props {
	tabs: string[];
	current?: string;
	onTabChange: (tab: string) => void;
}
/**
 * HorizontalTabs component for creating a horizontal tab navigation.
 *
 * This component allows users to switch between different tabs and displays the content associated with the selected tab.
 * It provides a user-friendly interface for navigating through different sections of an application.
 *
 * @param {string[]} tabs - An array of tab names to be displayed.
 * @param {(tab: string) => void} onTabChange - Callback function to handle tab changes.
 *
 * @example
 * <SelectionTabs
 *    tabs={["Tab 1", "Tab 2", "Tab 3"]}
 *   onTabChange={(tab) => console.log(`Selected tab: ${tab}`)}
 * />
 */
export function SelectionTabs({ tabs, current, onTabChange }: Props) {
	const [selectedTab, setSelectedTab] = useState<string>(
		tabs[tabs.indexOf(current || "")] || tabs[0]
	);

	// Handle tab change
	const handleTabChange = (tab: string) => {
		setSelectedTab(tab);
		onTabChange(tab);
	};

	return (
		<div className="flex justify-start">
			{tabs.map((tab) => (
				<div
					key={tab}
					className={`${styles.tab} ${
						tab === selectedTab ? styles.activeTab : ""
					}`}
					onClick={() => handleTabChange(tab)}
				>
					{tab}
				</div>
			))}
		</div>
	);
}
