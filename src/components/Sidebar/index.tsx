import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import styles from "./Sidebar.module.css";

type SidetabProps = {
	title: string;
	children?: ReactNode; // Children is now optional
};

type SidebarProps = {
	children?: ReactNode;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
};

export function Sidetab({ children }: SidetabProps) {
	return <>{children}</>; // Render children if provided, otherwise nothing
}

export function Sidebar({
	children,
	selectedIndex,
	setSelectedIndex,
}: SidebarProps) {
	const tabs = Children.toArray(children).filter(
		isValidElement
	) as React.ReactElement<{ title: string; children: ReactNode }>[];
	const titles = tabs.map((tab) => tab.props.title);
	const selectedContent = tabs[selectedIndex]?.props.children;

	return (
		<div className="flex">
			{tabs.length === 0 ? (
				""
			) : (
				<div className={styles.leftPanel}>{selectedContent}</div>
			)}

			<div className={styles.selectionBar}>
				<div
					className={styles.indicator}
					style={{ top: `${selectedIndex * 100}px` }}
				/>
				{titles.map((title, i) => (
					<div
						key={title}
						className={styles.menuItem}
						onClick={() => setSelectedIndex(i)}
					>
						<span className={styles.label}>{title}</span>
					</div>
				))}
			</div>
		</div>
	);
}
