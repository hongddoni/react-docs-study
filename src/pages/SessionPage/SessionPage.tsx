import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Question, Answer, Button } from "@/shared/ui";
import type {
	Question as QuestionType,
	QuestionResult,
	User,
} from "@/entities";
import { fetchQuestionsBySession, submitAnswer } from "@/shared/api";
import { loadUser } from "@/shared/lib";
import styles from "./SessionPage.module.css";

export const SessionPage = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();

	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string | string[]>>(
		{}
	);
	const [results, setResults] = useState<QuestionResult[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				// 사용자 정보 확인
				const user = loadUser();
				if (!user) {
					navigate("/", { replace: true });
					return;
				}
				setCurrentUser(user);

				// 문제 데이터 로드
				if (sessionId) {
					const questionsData = await fetchQuestionsBySession(
						sessionId
					);
					setQuestions(questionsData);
				}
			} catch (error) {
				console.error("데이터 로드 실패:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [sessionId, navigate]);

	if (isLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					<p>문제를 불러오는 중...</p>
				</div>
			</div>
		);
	}

	if (questions.length === 0) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>
					<p>문제를 불러올 수 없습니다.</p>
					<Button onClick={() => navigate("/")}>
						홈으로 돌아가기
					</Button>
				</div>
			</div>
		);
	}

	const currentQuestion = questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === questions.length - 1;

	const handleAnswerChange = (value: string | string[]) => {
		setAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: value,
		}));
	};

	const handleNext = async () => {
		const currentAnswer = answers[currentQuestion.id];

		if (!currentUser || !currentAnswer) return;

		try {
			// 정답 제출 및 확인
			const { isCorrect, submittedAt } = await submitAnswer(
				currentUser.id,
				currentQuestion.id,
				sessionId!,
				currentAnswer,
				currentQuestion.correctAnswer!
			);

			// 결과 저장
			const questionResult: QuestionResult = {
				question: currentQuestion,
				userAnswer: currentAnswer,
				isCorrect,
				submittedAt: new Date(submittedAt),
			};

			const newResults = [...results, questionResult];
			setResults(newResults);

			if (isLastQuestion) {
				// 모든 문제 완료 - 결과 페이지로 이동
				navigate(`/result/${sessionId}`, {
					state: {
						results: newResults,
						sessionTitle: `${sessionId}차시`,
					},
					replace: true,
				});
			} else {
				// 다음 문제로 이동
				setCurrentQuestionIndex((prev) => prev + 1);
			}
		} catch (error) {
			console.error("답안 제출 실패:", error);
			// 에러 발생해도 다음 문제로 진행 (로컬 결과만 저장)
			const questionResult: QuestionResult = {
				question: currentQuestion,
				userAnswer: currentAnswer,
				isCorrect: false, // 에러 시 오답 처리
				submittedAt: new Date(),
			};

			const newResults = [...results, questionResult];
			setResults(newResults);

			if (isLastQuestion) {
				navigate(`/result/${sessionId}`, {
					state: {
						results: newResults,
						sessionTitle: `${sessionId}차시`,
					},
					replace: true,
				});
			} else {
				setCurrentQuestionIndex((prev) => prev + 1);
			}
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
