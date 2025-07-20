import type { FC, ChangeEvent } from "react";
import styles from "./TextInput.module.css";

export interface TextInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	required?: boolean;
	type?: "text" | "email" | "password" | "number";
	maxLength?: number;
}

export const TextInput: FC<TextInputProps> = ({
	value,
	onChange,
	placeholder,
	label,
	error,
	disabled = false,
	required = false,
	type = "text",
	maxLength,
}) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className={styles.container}>
			{label && (
				<label className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}
			<input
				type={type}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
				maxLength={maxLength}
				className={`${styles.input} ${error ? styles.error : ""}`}
			/>
			{error && <span className={styles.errorMessage}>{error}</span>}
		</div>
	);
};
