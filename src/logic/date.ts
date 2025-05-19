export function getFormattedDate(): string {
	const date = new Date();
	const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const dd = String(date.getDate()).padStart(2, "0");
	const yyyy = date.getFullYear();
	return `${mm}/${dd}/${yyyy}`;
}
