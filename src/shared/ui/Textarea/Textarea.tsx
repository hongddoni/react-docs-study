import { useCallback, useRef, type FC } from "react";
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
	const ref = useRef<HTMLTextAreaElement>(null);

	const handleResizeHeight = useCallback(() => {
		if (ref.current) {
			ref.current.style.height = "auto";
			ref.current.style.height = ref.current.scrollHeight + "px";
		}
	}, []);

	return (
		<div className={styles.container}>
			{label && <label className={styles.label}>{label}</label>}
			<textarea
				className={styles.textarea}
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
					handleResizeHeight();
				}}
				placeholder={placeholder}
				rows={4}
				ref={ref}
			/>
		</div>
	);
};
