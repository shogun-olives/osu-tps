import { useState, useRef, useEffect } from "react";
import {
	getSettings,
	saveSettings,
	getHistory,
	saveHistory,
} from "./utils/Storage";
import { Sidebar, Sidetab } from "./components/Sidebar";
import SettingsMenu from "./components/Settings";
import History from "./components/History";
import { Stats } from "./components/LiveStats";
import { Graph } from "./components/Graph";
import { Credits } from "./components/Credits";
import { HoldToRestart } from "./components/Restart";
import type { Settings, TestData, TestResult } from "./types";
import { useTestInputListener } from "./hooks/TestStart";
import { getFormattedDate } from "./logic/date";

function App() {
	const [settings, setSettings] = useState(getSettings());
	const [active, setActive] = useState(false);
	const [complete, setComplete] = useState(false);
	const [dfltBPM, setDfltBPM] = useState(0);
	const [dfltUR, setDfltUR] = useState(0);
	const [sidebarSelectedIndex, setSidebarSelectedIndex] = useState(0);
	const [current, setData] = useState<TestData>({
		timestamps: [],
		bpms: [],
		ur: 0,
	});
	const [history, setHistory] = useState<TestResult[]>(getHistory());
	const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
	const currentRef = useRef<TestData>(current);

	useEffect(() => {
		currentRef.current = current;
	}, [current]);

	function restart() {
		setData({
			timestamps: [],
			bpms: [],
			ur: 0,
		});
		setActive(false);
		setComplete(false);
		setDfltBPM(0);
		setDfltUR(0);
		setSelectedTest(null);
	}

	function selectTest(test: TestResult) {
		setData(test.data);
		setActive(false);
		setComplete(true);
		setDfltBPM(test.bpm);
		setDfltUR(test.ur);
		setSelectedTest(test);
	}

	function updateSettings(newSettings: Settings) {
		setSettings(newSettings);
		saveSettings(newSettings);
	}

	function startTest() {
		if (!complete) {
			setActive(true);
		}
	}

	function endTest() {
		const finalData = currentRef.current;
		const latestBPM = finalData.bpms[finalData.bpms.length - 1] ?? 0;

		setActive(false);
		setComplete(true);

		const newTest = {
			id: Date.now().toString(),
			name: `Test (${history.length + 1})`,
			date: getFormattedDate(),
			bpm: latestBPM,
			ur: finalData.ur,
			data: finalData,
		};

		const newHistory = [...history, newTest];

		setHistory(newHistory);
		saveHistory(newHistory);
		setDfltBPM(latestBPM);
		setDfltUR(finalData.ur);

		// Select History tab (index 0)
		setSidebarSelectedIndex(0);

		// Automatically select the new test in history
		setSelectedTest(newTest);
	}

	function updateHistory(history: TestResult[]) {
		setHistory(history);
		saveHistory(history);
	}

	useTestInputListener({
		settings,
		data: current,
		active,
		complete,
		onStart: startTest,
		onEnd: endTest,
		setData,
	});

	return (
		<div className="flex h-screen w-screen">
			<Sidebar
				selectedIndex={sidebarSelectedIndex}
				setSelectedIndex={setSidebarSelectedIndex}
			>
				<Sidetab title="History">
					<History
						history={history}
						setHistory={updateHistory}
						selectedTest={selectedTest}
						setSelectedTest={setSelectedTest}
						selectTest={selectTest}
						deselectTest={restart}
					/>
				</Sidetab>
				<Sidetab title="Settings">
					<SettingsMenu
						restart={restart}
						settings={settings}
						setSettings={updateSettings}
					/>
				</Sidetab>
				<Sidetab title="Credits">
					<Credits />
				</Sidetab>
			</Sidebar>
			<div className="w-full flex flex-col justify-center px-[5%] mr-[60px] h-full">
				<div className="flex justify-between items-end w-full">
					<span className="opacity-70">
						{complete
							? `Hold ${settings.keybinds.retry.toLowerCase()} to retry`
							: ""}
					</span>
					<HoldToRestart settings={settings} onRestart={restart} />
				</div>
				<div className="flex justify-between items-center w-full items-end mb-[20px]">
					<h1>Stream v3</h1>
					<Stats
						active={active}
						dfltBPM={dfltBPM}
						dfltUR={dfltUR}
						data={current}
					/>
				</div>
				<Graph data={current}></Graph>
			</div>
		</div>
	);
}

export default App;
