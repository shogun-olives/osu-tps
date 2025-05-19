import type { ReactNode } from "react";

type Props = {
	name: string;
	children?: ReactNode;
};

export function LabelledInput({ name, children }: Props) {
	return (
		<div className="flex justify-between items-center w-full mb-[5px]">
			<label>{name}</label>
			<>{children}</>
		</div>
	);
}
