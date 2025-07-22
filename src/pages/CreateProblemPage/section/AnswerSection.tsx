import styles from "./section.module.css";
import { useForm } from "../context/useForm";
import { Radio, RadioGroup } from "@/shared/ui/Radio";

export const AnswerSection = () => {
	const { form, updateForm } = useForm();
	return (
		<div className={styles.section}>
			<h2 className={styles.sectionTitle}>답변 타입</h2>

			<RadioGroup
				checkedValue={form.answerType}
				name="answerType"
				onChange={(value) => updateForm("answerType", value)}
			>
				<Radio value="multiple-choice">객관식</Radio>
				<Radio value="subjective">주관식</Radio>
			</RadioGroup>
		</div>
	);
};
