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
			correctAnswer: Array.isArray(dbQuestion.correct_answer)
				? dbQuestion.correct_answer
				: [dbQuestion.correct_answer],
			explanation: dbQuestion.explanation,
			order: dbQuestion.order,
			sessionId: dbQuestion.session_id,
		}));
	} catch (error) {
		console.error("문제 불러오기 실패:", error);
		return [];
	}
};

// 정답 제출 및 확인 (POST API)
export const submitAnswer = async (
	userId: string,
	questionId: string,
	sessionId: string,
	answer: string | string[],
	correctAnswer: string[]
): Promise<{ isCorrect: boolean; submittedAt: string }> => {
	try {
		const isCorrect = checkAnswer(
			answer,
			Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]
		);
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
		const isCorrect = checkAnswer(
			answer,
			Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer]
		);
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

// 정답 확인 로직 (모든 정답을 배열로 관리)
export const checkAnswer = (
	userAnswer: string | string[],
	correctAnswer: string[]
): boolean => {
	// 사용자 답변을 배열로 정규화
	const normalizedUserAnswer = Array.isArray(userAnswer)
		? userAnswer
		: [userAnswer];

	// 길이가 다르면 틀림
	if (normalizedUserAnswer.length !== correctAnswer.length) return false;

	// 객관식 다중 선택의 경우 (배열 요소들 비교)
	if (
		normalizedUserAnswer.every(
			(ans) => typeof ans === "string" && ans.length <= 3
		)
	) {
		return normalizedUserAnswer
			.sort()
			.every((ans, index) => ans === correctAnswer.sort()[index]);
	}

	// 주관식의 경우 (대소문자 무시하고 공백 제거하여 비교)
	return normalizedUserAnswer.every(
		(ans, index) =>
			ans.trim().toLowerCase() ===
			correctAnswer[index]?.trim().toLowerCase()
	);
};

export const createQuestion = async (
	question: Omit<Question, "id" | "order">
): Promise<Question | null> => {
	try {
		// 같은 세션의 기존 문제들 중 최대 order 값 조회
		const { data: existingQuestions, error: orderError } = await supabase
			.from("questions")
			.select("order")
			.eq("session_id", question.sessionId)
			.order("order", { ascending: false })
			.limit(1);

		let nextOrder = 1; // 기본값
		if (!orderError && existingQuestions && existingQuestions.length > 0) {
			nextOrder = existingQuestions[0].order + 1;
		}

		// Supabase에서 UUID 자동 생성을 위해 id 필드 제외, order는 자동 계산
		const questionData = {
			title: question.title,
			description: question.description,
			image_url: question.imageUrl,
			answer_type: question.answerType,
			selection_mode: question.selectionMode,
			options: question.options,
			correct_answer: question.correctAnswer,
			explanation: question.explanation,
			order: nextOrder,
			session_id: question.sessionId,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		const { data, error } = await supabase
			.from("questions")
			.insert([questionData])
			.select()
			.single();

		if (error) {
			console.error("Supabase 문제 생성 실패:", error);
			return null;
		}

		console.log("문제가 성공적으로 생성되었습니다:", data);

		// 데이터베이스 형식을 Question 타입으로 변환
		const questionResult: Question = {
			id: data.id,
			title: data.title,
			description: data.description,
			imageUrl: data.image_url,
			answerType: data.answer_type,
			selectionMode: data.selection_mode,
			options: data.options,
			correctAnswer: data.correct_answer,
			explanation: data.explanation,
			order: data.order,
			sessionId: data.session_id,
		};

		return questionResult;
	} catch (error) {
		console.error("문제 생성 중 예상치 못한 오류:", error);
		return null;
	}
};
