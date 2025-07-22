import styles from "./SingleSelect.module.css";
import { useForm } from "../context/useForm";
import { RadioGroup, Radio } from "@/shared/ui/Radio";

export const SingleSelect = () => {
	const { form, updateForm } = useForm();
	return (
		<div className={styles.correctAnswerOptions}>
			<RadioGroup
				type="vertical"
				name="correctAnswer"
				checkedValue={form.correctAnswer[0]}
				onChange={(value) => updateForm("correctAnswer", value)}
			>
				{form.options.map((option) => (
					<Radio
						key={option.id}
						value={option.id}
						checked={form.correctAnswer.includes(option.id)}
					>
						{option.id.toUpperCase()}. {option.text}
					</Radio>
				))}
			</RadioGroup>
		</div>
	);
};
