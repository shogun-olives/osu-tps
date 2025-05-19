import styles from "./CreditRow.module.css";

interface Props {
	username: string;
	link: string;
	src: string;
}

export function CreditRow({ username, link, src }: Props) {
	const openLink = () => {
		window.open(link, "_blank", "noopener,noreferrer");
	};

	return (
		<div
			className={styles.creditRow}
			onClick={openLink}
			role="link"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") openLink();
			}}
		>
			<img
				src={src}
				alt={`${username} icon`}
				className={styles.creditIcon}
			/>
			<span className={styles.creditUsername}>{username}</span>
		</div>
	);
}
