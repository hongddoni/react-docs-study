import styles from "./section.module.css";
import { useForm } from "../context/useForm";
import { Button, TextInput } from "@/shared/ui";
import { SingleSelect } from "../SelectField/SingleSelect";
import { MultiSelect } from "../SelectField/MultiSelect";
import { RadioGroup, Radio } from "@/shared/ui/Radio";

export const MultipleSection = () => {
	const { form, updateForm, errors, removeOption, updateOption, addOption } =
		useForm();

	if (form.answerType !== "multiple-choice") return null;

	return (
		<>
			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>객관식 설정</h2>
				<RadioGroup
					name="selectionMode"
					checkedValue={form.selectionMode}
					onChange={(value) => updateForm("selectionMode", value)}
				>
					<Radio value="single">단일 선택</Radio>
					<Radio value="multiple">다중 선택</Radio>
				</RadioGroup>

				<div className={styles.optionsContainer}>
					<div className={styles.optionsHeader}>
						<h3>선택지</h3>
						<Button
							variant="secondary"
							size="small"
							onClick={addOption}
						>
							+ 선택지 추가
						</Button>
					</div>

					{errors.options && (
						<div className={styles.errorMessage}>
							{errors.options}
						</div>
					)}

					{form.options.map((option, index) => (
						<div key={option.id} className={styles.optionItem}>
							<span className={styles.optionLabel}>
								{option.id.toUpperCase()}.
							</span>
							<TextInput
								value={option.text}
								onChange={(value) => updateOption(index, value)}
								placeholder={`선택지 ${option.id.toUpperCase()} 내용`}
							/>
							{form.options.length > 2 && (
								<Button
									variant="danger"
									size="small"
									onClick={() => removeOption(index)}
								>
									삭제
								</Button>
							)}
						</div>
					))}
				</div>

				<div className={styles.correctAnswerSection}>
					<h3>정답 선택</h3>
					{errors.correctAnswer && (
						<div className={styles.errorMessage}>
							{errors.correctAnswer}
						</div>
					)}

					{form.selectionMode === "single" ? (
						<SingleSelect />
					) : (
						<MultiSelect />
					)}
				</div>
			</div>
		</>
	);
};
