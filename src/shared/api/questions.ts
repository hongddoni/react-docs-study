import {
	supabase,
	type DatabaseQuestion,
	type DatabaseUserAnswer,
} from "./supabase";
import type { Question } from "@/entities";

// 세션별 문제 불러오기 (GET API)
export const fetchQuestionsBySession = async (
	sessionId: string
): Promise<Question[]> => {
	try {
		const { data, error } = await supabase
			.from("questions")
			.select("*")
			.eq("session_id", sessionId)
			.order("order", { ascending: true });

		if (error) throw error;

		// 데이터베이스 형식을 앱 형식으로 변환
		return data.map((dbQuestion: DatabaseQuestion) => ({
			id: dbQuestion.id,
			title: dbQuestion.title,
			description: dbQuestion.description,
			imageUrl: dbQuestion.image_url,
			answerType: dbQuestion.answer_type,
			selectionMode: dbQuestion.selection_mode,
			options: dbQuestion.options,
			correctAnswer: dbQuestion.correct_answer,
			explanation: dbQuestion.explanation,
			order: dbQuestion.order,
		}));
	} catch (error) {
		console.error("문제 불러오기 실패:", error);
		// 개발용 임시 데이터 반환
		return getTemporaryQuestions(sessionId);
	}
};

// 정답 제출 및 확인 (POST API)
export const submitAnswer = async (
	userId: string,
	questionId: string,
	sessionId: string,
	answer: string | string[],
	correctAnswer: string | string[]
): Promise<{ isCorrect: boolean; submittedAt: string }> => {
	try {
		const isCorrect = checkAnswer(answer, correctAnswer);
		const submittedAt = new Date().toISOString();

		const { error } = await supabase.from("user_answers").insert({
			user_id: userId,
			question_id: questionId,
			session_id: sessionId,
			answer: answer,
			is_correct: isCorrect,
			submitted_at: submittedAt,
		});

		if (error) throw error;

		return { isCorrect, submittedAt };
	} catch (error) {
		console.error("답안 제출 실패:", error);
		// 실패해도 로컬에서 정답 확인은 수행
		const isCorrect = checkAnswer(answer, correctAnswer);
		return { isCorrect, submittedAt: new Date().toISOString() };
	}
};

// 사용자의 세션별 답안 불러오기
export const fetchUserAnswers = async (
	userId: string,
	sessionId: string
): Promise<DatabaseUserAnswer[]> => {
	try {
		const { data, error } = await supabase
			.from("user_answers")
			.select("*")
			.eq("user_id", userId)
			.eq("session_id", sessionId)
			.order("submitted_at", { ascending: true });

		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error("사용자 답안 불러오기 실패:", error);
		return [];
	}
};

// 정답 확인 로직
const checkAnswer = (
	userAnswer: string | string[],
	correctAnswer: string | string[]
): boolean => {
	if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
		// 다중 선택의 경우
		if (userAnswer.length !== correctAnswer.length) return false;
		return userAnswer
			.sort()
			.every((ans, index) => ans === correctAnswer.sort()[index]);
	} else if (
		typeof userAnswer === "string" &&
		typeof correctAnswer === "string"
	) {
		// 단일 선택 또는 주관식의 경우
		return (
			userAnswer.trim().toLowerCase() ===
			correctAnswer.trim().toLowerCase()
		);
	}
	return false;
};

// 개발용 임시 데이터 (Supabase 연결 실패시 사용)
const getTemporaryQuestions = (sessionId: string): Question[] => {
	const baseQuestions: Question[] = [
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
			explanation:
				"React는 가상 DOM, 컴포넌트 기반 아키텍처, 단방향 데이터 흐름 모두를 특징으로 합니다.",
			order: 1,
		},
		{
			id: "2",
			title: "useState 훅에 대해 설명하세요.",
			answerType: "subjective",
			explanation:
				"useState는 함수형 컴포넌트에서 상태를 관리할 수 있게 해주는 React Hook입니다.",
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
			explanation:
				"JSX, Props, State, Component 모두 React의 핵심 개념들입니다.",
			order: 3,
		},
	];

	return baseQuestions;
};
