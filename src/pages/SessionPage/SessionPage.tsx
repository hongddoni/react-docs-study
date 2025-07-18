import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Question, Answer, Button } from "@/shared/ui";
import type { Question as QuestionType } from "@/entities";
import styles from "./SessionPage.module.css";

export const SessionPage = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();

	// 임시 데이터 - 실제로는 API에서 가져올 데이터
	const questions: QuestionType[] = [
		{
			id: "1",
			title: "React의 주요 특징은 무엇인가요?",
			description: "React의 가장 중요한 특징을 선택하세요.",
			answerType: "multiple-choice",
			selectionMode: "single",
			options: [
				{ id: "a", text: "가상 DOM" },
				{ id: "b", text: "컴포넌트 기반" },
				{ id: "c", text: "단방향 데이터 흐름" },
				{ id: "d", text: "모두 해당" },
			],
			correctAnswer: "d",
			order: 1,
		},
		{
			id: "2",
			title: "useState 훅에 대해 설명하세요.",
			answerType: "subjective",
			order: 2,
		},
		{
			id: "3",
			title: "React에서 사용되는 개념들을 모두 선택하세요.",
			answerType: "multiple-choice",
			selectionMode: "multiple",
			options: [
				{ id: "a", text: "JSX" },
				{ id: "b", text: "Props" },
				{ id: "c", text: "State" },
				{ id: "d", text: "Component" },
			],
			correctAnswer: ["a", "b", "c", "d"],
			order: 3,
		},
	];

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string | string[]>>(
		{}
	);

	const currentQuestion = questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === questions.length - 1;

	const handleAnswerChange = (value: string | string[]) => {
		setAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: value,
		}));
	};

	const handleNext = () => {
		if (isLastQuestion) {
			// 결과 페이지로 이동하거나 결과 처리
			console.log("모든 답변:", answers);
			navigate("/");
		} else {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	};

	const currentAnswer = answers[currentQuestion.id];
	const hasAnswer =
		currentAnswer !== undefined &&
		(typeof currentAnswer === "string"
			? currentAnswer.length > 0
			: currentAnswer.length > 0);

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
				<span className={styles.sessionInfo}>{sessionId}차시</span>
			</div>

			<div className={styles.content}>
				<Question
					title={currentQuestion.title}
					description={currentQuestion.description}
					imageUrl={currentQuestion.imageUrl}
					questionNumber={currentQuestionIndex + 1}
					totalQuestions={questions.length}
				/>

				<Answer
					type={currentQuestion.answerType}
					selectionMode={currentQuestion.selectionMode}
					options={currentQuestion.options}
					value={currentAnswer}
					onChange={handleAnswerChange}
				/>

				<div className={styles.navigation}>
					<Button
						variant="secondary"
						onClick={handlePrevious}
						disabled={currentQuestionIndex === 0}
					>
						이전
					</Button>

					<Button
						variant="primary"
						onClick={handleNext}
						disabled={!hasAnswer}
					>
						{isLastQuestion ? "완료" : "다음"}
					</Button>
				</div>
			</div>
		</div>
	);
};
