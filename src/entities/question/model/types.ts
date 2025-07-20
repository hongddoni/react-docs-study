import type { AnswerType, SelectionMode, AnswerOption } from "@/shared/ui";

export interface Question {
	id: string;
	title: string;
	description?: string;
	imageUrl?: string;
	answerType: AnswerType;
	selectionMode?: SelectionMode;
	options?: AnswerOption[];
	correctAnswer?: string[];
	explanation?: string; // 해설 필드 추가
	order: number;
	sessionId: string;
}

export interface QuestionSession {
	id: string;
	title: string;
	description?: string;
	questions: Question[];
	sessionNumber: number;
	isLocked: boolean;
	requiredPermission?: string;
}

export interface UserAnswer {
	questionId: string;
	sessionId: string;
	answer: string | string[];
	isCorrect?: boolean;
	submittedAt: Date;
}

export interface UserProgress {
	userId: string;
	sessionId: string;
	completedQuestions: string[];
	currentQuestionIndex: number;
	score: number;
	totalQuestions: number;
	isCompleted: boolean;
	startedAt: Date;
	completedAt?: Date;
}

// 결과 페이지용 타입 추가
export interface QuestionResult {
	question: Question;
	userAnswer: string | string[];
	isCorrect: boolean;
	submittedAt: Date;
}
