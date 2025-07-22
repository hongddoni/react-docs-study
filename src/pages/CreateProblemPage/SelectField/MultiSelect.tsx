import styles from "./MultiSelect.module.css";
import { useForm } from "../context/useForm";

export const MultiSelect = () => {
	const { form, updateForm } = useForm();
	return (
		<div className={styles.correctAnswerOptions}>
			{form.options.map((option) => {
				const currentAnswers = Array.isArray(form.correctAnswer)
					? form.correctAnswer
					: [];
				const isChecked = currentAnswers.includes(option.id);

				return (
					<label key={option.id} className={styles.radioLabel}>
						<input
							type="checkbox"
							checked={isChecked}
							onChange={(e) => {
								const currentAnswers = Array.isArray(
									form.correctAnswer
								)
									? form.correctAnswer
									: [];
								if (e.target.checked) {
									updateForm("correctAnswer", [
										...currentAnswers,
										option.id,
									]);
								} else {
									updateForm(
										"correctAnswer",
										currentAnswers.filter(
											(id) => id !== option.id
										)
									);
								}
							}}
						/>
						<span>
							{option.id.toUpperCase()}. {option.text}
						</span>
					</label>
				);
			})}
		</div>
	);
};
