import { useCallback, useState } from "react";
import type {
	Question as QuestionType,
	QuestionResult,
} from "@/entities/question/model/types";
import type { User } from "@/entities/user/model/types";
import { useNavigate, useParams } from "react-router-dom";
import { loadUser } from "@/shared/lib";
import { fetchQuestionsBySession, submitAnswer } from "@/shared/api";
import { debounce } from "es-toolkit";
import { useQuestion } from "./useQuestion";
import { useAnswer } from "./useAnswer";

export const useSession = () => {
	const {
		questions,
		currentQuestionIndex,
		setQuestions,
		setCurrentQuestionIndex,
	} = useQuestion();
	const { answers, setAnswers, results, setResults } = useAnswer();

	console.log(questions, currentQuestionIndex);
	const currentQuestion = questions[currentQuestionIndex];

	const isLastQuestion = currentQuestionIndex === questions.length - 1;

	const currentAnswer = answers[currentQuestion?.id];

	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();

	const hasAnswer =
		currentAnswer !== undefined &&
		(typeof currentAnswer === "string"
			? currentAnswer.length > 0
			: currentAnswer.length > 0);

	const loadData = useCallback(async () => {
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
				const questionsData = await fetchQuestionsBySession(sessionId);
				setQuestions(questionsData);
			}
		} catch (error) {
			console.error("데이터 로드 실패:", error);
		} finally {
			setIsLoading(false);
		}
	}, [sessionId, navigate, setQuestions]);

	const handleAnswerChange = useCallback(
		(value: string | string[]) => {
			setAnswers((prev) => ({
				...prev,
				[currentQuestion.id]: value,
			}));
		},
		[currentQuestion.id, setAnswers]
	);

	const handlePrevious = useCallback(() => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	}, [currentQuestionIndex, setCurrentQuestionIndex]);

	const handleNext = debounce(
		useCallback(async () => {
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
		}, [
			answers,
			currentQuestion,
			currentUser,
			sessionId,
			results,
			setResults,
			isLastQuestion,
			navigate,
			setCurrentQuestionIndex,
		]),
		1000
	);

	return {
		questions,
		currentQuestionIndex,
		answers,
		results,
		isLoading,
		currentUser,
		loadData,
		handleAnswerChange,
		handleNext,
		handlePrevious,
		sessionId,
		navigate,
		currentQuestion,
		isLastQuestion,
		hasAnswer,
		currentAnswer,
	};
};
