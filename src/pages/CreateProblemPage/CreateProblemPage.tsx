import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "@/shared/ui";
import type { Question } from "@/entities";
import type {
	AnswerType,
	SelectionMode,
	AnswerOption,
} from "@/shared/ui/Answer/Answer";
import { createQuestion } from "@/shared/api";
import styles from "./CreateProblemPage.module.css";

interface QuestionForm {
	title: string;
	description: string;
	imageUrl: string;
	answerType: AnswerType;
	selectionMode: SelectionMode;
	options: AnswerOption[];
	correctAnswer: string[];
	explanation: string;
	sessionId: string;
}

export const CreateProblemPage = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState<QuestionForm>({
		title: "",
		description: "",
		imageUrl: "",
		answerType: "multiple-choice",
		selectionMode: "single",
		options: [
			{ id: "a", text: "" },
			{ id: "b", text: "" },
		],
		correctAnswer: [],
		explanation: "",
		sessionId: "2",
	});

	const clearForm = () => {
		setForm({
			title: "",
			description: "",
			imageUrl: "",
			answerType: "multiple-choice",
			selectionMode: "single",
			options: [
				{ id: "a", text: "" },
				{ id: "b", text: "" },
			],
			correctAnswer: [],
			explanation: "",
			sessionId: "1",
		});
	};

	const [errors, setErrors] = useState<Record<string, string>>({});

	const updateForm = (field: keyof QuestionForm, value: any) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		// 에러 클리어
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const addOption = () => {
		const nextId = String.fromCharCode(97 + form.options.length); // a, b, c, d...
		setForm((prev) => ({
			...prev,
			options: [...prev.options, { id: nextId, text: "" }],
		}));
	};

	const removeOption = (index: number) => {
		if (form.options.length <= 2) return; // 최소 2개 유지

		setForm((prev) => ({
			...prev,
			options: prev.options.filter((_, i) => i !== index),
		}));
	};

	const updateOption = (index: number, text: string) => {
		setForm((prev) => ({
			...prev,
			options: prev.options.map((option, i) =>
				i === index ? { ...option, text } : option
			),
		}));
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!form.title.trim()) {
			newErrors.title = "문제 제목을 입력하세요";
		}

		if (!form.sessionId.trim()) {
			newErrors.sessionId = "세션 ID를 입력하세요";
		}

		if (form.answerType === "multiple-choice") {
			const emptyOptions = form.options.some(
				(option) => !option.text.trim()
			);
			if (emptyOptions) {
				newErrors.options = "모든 선택지를 입력하세요";
			}

			if (!form.correctAnswer || form.correctAnswer.length === 0) {
				newErrors.correctAnswer = "정답을 선택하세요";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) return;

		try {
			const newQuestion: Omit<Question, "id" | "order"> = {
				title: form.title,
				description: form.description || undefined,
				imageUrl: form.imageUrl || undefined,
				answerType: form.answerType,
				selectionMode:
					form.answerType === "multiple-choice"
						? form.selectionMode
						: undefined,
				options:
					form.answerType === "multiple-choice"
						? form.options
						: undefined,
				correctAnswer: form.correctAnswer,
				explanation: form.explanation || undefined,
				sessionId: form.sessionId,
			};

			console.log("생성된 문제:", newQuestion);

			// Supabase에 저장
			const savedQuestion = await createQuestion(newQuestion);

			if (savedQuestion) {
				console.log("문제가 성공적으로 저장되었습니다:", savedQuestion);
				clearForm();
			} else {
				alert("문제 저장에 실패했습니다. 다시 시도해주세요.");
			}
		} catch (error) {
			console.error("문제 저장 실패:", error);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Button
					variant="secondary"
					size="small"
					onClick={() => navigate("/")}
				>
					← 홈으로
				</Button>
				<h1 className={styles.title}>문제 생성</h1>
			</div>

			<div className={styles.formContainer}>
				{/* 기본 정보 */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>기본 정보</h2>

					<div className={styles.field}>
						<TextInput
							label="문제 제목"
							value={form.title}
							onChange={(value) => updateForm("title", value)}
							placeholder="문제 제목을 입력하세요"
							required
							error={errors.title}
						/>
					</div>

					<div className={styles.field}>
						<TextInput
							label="문제 설명"
							value={form.description}
							onChange={(value) =>
								updateForm("description", value)
							}
							placeholder="문제에 대한 추가 설명 (선택사항)"
						/>
					</div>

					<div className={styles.field}>
						<TextInput
							label="이미지 URL"
							value={form.imageUrl}
							onChange={(value) => updateForm("imageUrl", value)}
							placeholder="이미지 URL (선택사항)"
						/>
					</div>

					<div className={styles.field}>
						<TextInput
							label="세션 ID"
							value={form.sessionId}
							onChange={(value) => updateForm("sessionId", value)}
							placeholder="문제가 속할 세션 ID를 입력하세요"
							required
							error={errors.sessionId}
						/>
					</div>
				</div>

				{/* 답변 타입 */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>답변 타입</h2>

					<div className={styles.radioGroup}>
						<label className={styles.radioLabel}>
							<input
								type="radio"
								name="answerType"
								value="multiple-choice"
								checked={form.answerType === "multiple-choice"}
								onChange={(e) =>
									updateForm(
										"answerType",
										e.target.value as AnswerType
									)
								}
							/>
							<span>객관식</span>
						</label>
						<label className={styles.radioLabel}>
							<input
								type="radio"
								name="answerType"
								value="subjective"
								checked={form.answerType === "subjective"}
								onChange={(e) =>
									updateForm(
										"answerType",
										e.target.value as AnswerType
									)
								}
							/>
							<span>주관식</span>
						</label>
					</div>
				</div>

				{/* 객관식 설정 */}
				{form.answerType === "multiple-choice" && (
					<div className={styles.section}>
						<h2 className={styles.sectionTitle}>객관식 설정</h2>

						<div className={styles.radioGroup}>
							<label className={styles.radioLabel}>
								<input
									type="radio"
									name="selectionMode"
									value="single"
									checked={form.selectionMode === "single"}
									onChange={(e) =>
										updateForm(
											"selectionMode",
											e.target.value as SelectionMode
										)
									}
								/>
								<span>단일 선택</span>
							</label>
							<label className={styles.radioLabel}>
								<input
									type="radio"
									name="selectionMode"
									value="multiple"
									checked={form.selectionMode === "multiple"}
									onChange={(e) =>
										updateForm(
											"selectionMode",
											e.target.value as SelectionMode
										)
									}
								/>
								<span>다중 선택</span>
							</label>
						</div>

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
								<div
									key={option.id}
									className={styles.optionItem}
								>
									<span className={styles.optionLabel}>
										{option.id.toUpperCase()}.
									</span>
									<TextInput
										value={option.text}
										onChange={(value) =>
											updateOption(index, value)
										}
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

						{/* 정답 선택 */}
						<div className={styles.correctAnswerSection}>
							<h3>정답 선택</h3>
							{errors.correctAnswer && (
								<div className={styles.errorMessage}>
									{errors.correctAnswer}
								</div>
							)}

							{form.selectionMode === "single" ? (
								<div className={styles.correctAnswerOptions}>
									{form.options.map((option) => (
										<label
											key={option.id}
											className={styles.radioLabel}
										>
											<input
												type="radio"
												name="correctAnswer"
												value={option.id}
												checked={form.correctAnswer.includes(
													option.id
												)}
												onChange={(e) =>
													updateForm(
														"correctAnswer",
														[e.target.value]
													)
												}
											/>
											<span>
												{option.id.toUpperCase()}.{" "}
												{option.text}
											</span>
										</label>
									))}
								</div>
							) : (
								<div className={styles.correctAnswerOptions}>
									{form.options.map((option) => {
										const currentAnswers = Array.isArray(
											form.correctAnswer
										)
											? form.correctAnswer
											: [];
										const isChecked =
											currentAnswers.includes(option.id);

										return (
											<label
												key={option.id}
												className={styles.radioLabel}
											>
												<input
													type="checkbox"
													checked={isChecked}
													onChange={(e) => {
														const currentAnswers =
															Array.isArray(
																form.correctAnswer
															)
																? form.correctAnswer
																: [];
														if (e.target.checked) {
															updateForm(
																"correctAnswer",
																[
																	...currentAnswers,
																	option.id,
																]
															);
														} else {
															updateForm(
																"correctAnswer",
																currentAnswers.filter(
																	(id) =>
																		id !==
																		option.id
																)
															);
														}
													}}
												/>
												<span>
													{option.id.toUpperCase()}.{" "}
													{option.text}
												</span>
											</label>
										);
									})}
								</div>
							)}
						</div>
					</div>
				)}

				{/* 주관식 설정 */}
				{form.answerType === "subjective" && (
					<div className={styles.section}>
						<h2 className={styles.sectionTitle}>정답</h2>
						<TextInput
							label="정답"
							value={
								form.correctAnswer.length > 0
									? form.correctAnswer[0]
									: ""
							}
							onChange={(value) =>
								updateForm(
									"correctAnswer",
									value ? [value] : []
								)
							}
							placeholder="정답을 입력하세요"
						/>
					</div>
				)}

				{/* 해설 */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>해설</h2>
					<div className={styles.field}>
						<TextInput
							label="해설"
							value={form.explanation}
							onChange={(value) =>
								updateForm("explanation", value)
							}
							placeholder="문제에 대한 해설을 입력하세요 (선택사항)"
						/>
					</div>
				</div>

				{/* 저장 버튼 */}
				<div className={styles.saveSection}>
					<Button
						variant="primary"
						size="large"
						onClick={handleSave}
						fullWidth
					>
						문제 저장
					</Button>
				</div>
			</div>
		</div>
	);
};
