import { AnswerType, SelectionMode, AnswerOption } from "@/shared/ui";

export interface Question {
	id: string;
	title: string;
	description?: string;
	imageUrl?: string;
	answerType: AnswerType;
	selectionMode?: SelectionMode;
	options?: AnswerOption[];
	correctAnswer?: string | string[];
	order: number;
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
