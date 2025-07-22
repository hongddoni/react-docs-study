import styles from "./section.module.css";
import { useForm } from "../context/useForm";
import { TextInput } from "@/shared/ui";

export const ShortAnswerSection = () => {
	const { form, updateForm } = useForm();

	if (form.answerType !== "subjective") return null;

	return (
		<div className={styles.section}>
			<h2 className={styles.sectionTitle}>정답</h2>
			<TextInput
				label="정답"
				value={
					form.correctAnswer.length > 0 ? form.correctAnswer[0] : ""
				}
				onChange={(value) =>
					updateForm("correctAnswer", value ? [value] : [])
				}
				placeholder="정답을 입력하세요"
			/>
		</div>
	);
};
