import { useEffect } from "react";
import { Question, Answer, Button, Title, CodeBlock } from "@/shared/ui";
import styles from "./SessionPage.module.css";
import { useBeforeUnload } from "@/shared/lib/utils";
import { useSession } from "./useSession";

export const SessionPage = () => {
	const {
		questions,
		currentQuestionIndex,
		navigate,
		isLoading,
		loadData,
		handleAnswerChange,
		handleNext,
		handlePrevious,
		sessionId,
		currentQuestion,
		isLastQuestion,
		hasAnswer,
		currentAnswer,
	} = useSession();
	useBeforeUnload();

	useEffect(() => {
		loadData();
	}, [loadData]);

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

	return (
		<div className={styles.container}>
			<Title hasBackButton>{sessionId}차시</Title>

			<div className={styles.content}>
				<Question
					title={currentQuestion.title}
					description={currentQuestion.description}
					questionNumber={currentQuestionIndex + 1}
					totalQuestions={questions.length}
				/>

				{currentQuestion.code && (
					<CodeBlock language="typescript">
						{currentQuestion.code}
					</CodeBlock>
				)}

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
