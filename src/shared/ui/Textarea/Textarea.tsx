import type { FC } from "react";
import styles from "./Textarea.module.css";

export interface TextareaProps {
	label?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
}

export const Textarea: FC<TextareaProps> = ({
	label,
	value,
	onChange,
	placeholder,
}) => {
	return (
		<div className={styles.container}>
			{label && <label className={styles.label}>{label}</label>}
			<textarea
				className={styles.textarea}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				rows={4}
			/>
		</div>
	);
};
