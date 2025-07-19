import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Question, Answer } from "@/shared/ui";
import type { QuestionResult } from "@/entities";
import styles from "./ResultPage.module.css";

interface LocationState {
	results: QuestionResult[];
	sessionTitle: string;
}

export const ResultPage = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();
	const location = useLocation();

	const [results, setResults] = useState<QuestionResult[]>([]);
	const [sessionTitle, setSessionTitle] = useState("");
	const [currentResultIndex, setCurrentResultIndex] = useState(0);

	useEffect(() => {
		// 페이지 새로고침 방지 및 뒤로가기 방지
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};

		const handlePopState = () => {
			navigate("/", { replace: true });
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("popstate", handlePopState);

		// location state에서 결과 데이터 가져오기
		const state = location.state as LocationState;
		if (state?.results) {
			setResults(state.results);
			setSessionTitle(state.sessionTitle || `${sessionId}차시`);
		} else {
			// 결과 데이터가 없으면 홈으로 리다이렉트
			navigate("/", { replace: true });
		}

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("popstate", handlePopState);
		};
	}, [sessionId, location.state, navigate]);

	if (results.length === 0) {
		return null; // 데이터 로딩 중이거나 리다이렉트 중
	}

	const currentResult = results[currentResultIndex];
	const correctCount = results.filter((r) => r.isCorrect).length;
	const totalCount = results.length;
	const score = Math.round((correctCount / totalCount) * 100);

	const handleNext = () => {
		if (currentResultIndex < results.length - 1) {
			setCurrentResultIndex((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentResultIndex > 0) {
			setCurrentResultIndex((prev) => prev - 1);
		}
	};

	const handleGoHome = () => {
		navigate("/", { replace: true });
	};

	const getAnswerDisplay = (answer: string | string[]): string => {
		if (Array.isArray(answer)) {
			return answer.join(", ");
		}
		return answer;
	};

	const getCorrectAnswerDisplay = (
		correctAnswer: string | string[]
	): string => {
		if (Array.isArray(correctAnswer)) {
			const question = currentResult.question;
			if (question.options) {
				const correctTexts = correctAnswer.map(
					(id) =>
						question.options?.find((opt) => opt.id === id)?.text ||
						id
				);
				return correctTexts.join(", ");
			}
			return correctAnswer.join(", ");
		}

		const question = currentResult.question;
		if (question.options && question.answerType === "multiple-choice") {
			const correctOption = question.options.find(
				(opt) => opt.id === correctAnswer
			);
			return correctOption ? correctOption.text : correctAnswer;
		}

		return correctAnswer;
	};

	const getUserAnswerDisplay = (userAnswer: string | string[]): string => {
		if (Array.isArray(userAnswer)) {
			const question = currentResult.question;
			if (question.options) {
				const userTexts = userAnswer.map(
					(id) =>
						question.options?.find((opt) => opt.id === id)?.text ||
						id
				);
				return userTexts.join(", ");
			}
			return userAnswer.join(", ");
		}

		const question = currentResult.question;
		if (question.options && question.answerType === "multiple-choice") {
			const userOption = question.options.find(
				(opt) => opt.id === userAnswer
			);
			return userOption ? userOption.text : userAnswer;
		}

		return userAnswer;
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>{sessionTitle} 결과</h1>
				<div className={styles.scoreSection}>
					<div className={styles.score}>
						<span className={styles.scoreValue}>{score}점</span>
						<span className={styles.scoreDetail}>
							({correctCount}/{totalCount} 정답)
						</span>
					</div>
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.questionHeader}>
					<span className={styles.questionCounter}>
						문제 {currentResultIndex + 1} / {totalCount}
					</span>
					<span
						className={`${styles.resultBadge} ${
							currentResult.isCorrect
								? styles.correct
								: styles.incorrect
						}`}
					>
						{currentResult.isCorrect ? "정답" : "오답"}
					</span>
				</div>

				<Question
					title={currentResult.question.title}
					description={currentResult.question.description}
					imageUrl={currentResult.question.imageUrl}
				/>

				<div className={styles.answerSection}>
					<div className={styles.answerItem}>
						<h4 className={styles.answerLabel}>내 답안</h4>
						<div
							className={`${styles.answerValue} ${
								currentResult.isCorrect
									? styles.correctAnswer
									: styles.wrongAnswer
							}`}
						>
							{getUserAnswerDisplay(currentResult.userAnswer)}
						</div>
					</div>

					{!currentResult.isCorrect && (
						<div className={styles.answerItem}>
							<h4 className={styles.answerLabel}>정답</h4>
							<div
								className={`${styles.answerValue} ${styles.correctAnswer}`}
							>
								{getCorrectAnswerDisplay(
									currentResult.question.correctAnswer!
								)}
							</div>
						</div>
					)}

					{currentResult.question.explanation && (
						<div className={styles.explanationSection}>
							<h4 className={styles.explanationLabel}>해설</h4>
							<p className={styles.explanationText}>
								{currentResult.question.explanation}
							</p>
						</div>
					)}
				</div>

				<div className={styles.navigation}>
					<Button
						variant="secondary"
						onClick={handlePrevious}
						disabled={currentResultIndex === 0}
					>
						이전 문제
					</Button>

					{currentResultIndex === results.length - 1 ? (
						<Button variant="primary" onClick={handleGoHome}>
							홈으로
						</Button>
					) : (
						<Button variant="primary" onClick={handleNext}>
							다음 문제
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
