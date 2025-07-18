import { TextInput } from "../TextInput";
import styles from "./Answer.module.css";

export type AnswerType = "subjective" | "multiple-choice";
export type SelectionMode = "single" | "multiple";

export interface AnswerOption {
	id: string;
	text: string;
	isCorrect?: boolean;
}

export interface AnswerProps {
	type: AnswerType;
	selectionMode?: SelectionMode;
	options?: AnswerOption[];
	value?: string | string[];
	onChange: (value: string | string[]) => void;
	placeholder?: string;
	disabled?: boolean;
}

export const Answer = ({
	type,
	selectionMode = "single",
	options = [],
	value,
	onChange,
	placeholder,
	disabled = false,
}: AnswerProps) => {
	const handleSubjectiveChange = (newValue: string) => {
		onChange(newValue);
	};

	const handleSingleChoiceChange = (optionId: string) => {
		onChange(optionId);
	};

	const handleMultipleChoiceChange = (optionId: string) => {
		const currentValues = Array.isArray(value) ? value : [];
		const newValues = currentValues.includes(optionId)
			? currentValues.filter((id) => id !== optionId)
			: [...currentValues, optionId];
		onChange(newValues);
	};

	if (type === "subjective") {
		return (
			<div className={styles.container}>
				<TextInput
					value={typeof value === "string" ? value : ""}
					onChange={handleSubjectiveChange}
					placeholder={placeholder || "답을 입력하세요"}
					disabled={disabled}
				/>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.optionsContainer}>
				{options.map((option) => {
					const isSelected =
						selectionMode === "single"
							? value === option.id
							: Array.isArray(value) && value.includes(option.id);

					return (
						<label
							key={option.id}
							className={`${styles.optionLabel} ${
								isSelected ? styles.selected : ""
							} ${disabled ? styles.disabled : ""}`}
						>
							<input
								type={
									selectionMode === "single"
										? "radio"
										: "checkbox"
								}
								name={
									selectionMode === "single"
										? "answer"
										: undefined
								}
								checked={isSelected}
								onChange={() => {
									if (disabled) return;
									if (selectionMode === "single") {
										handleSingleChoiceChange(option.id);
									} else {
										handleMultipleChoiceChange(option.id);
									}
								}}
								className={styles.optionInput}
								disabled={disabled}
							/>
							<span className={styles.optionText}>
								{option.text}
							</span>
						</label>
					);
				})}
			</div>
		</div>
	);
};
