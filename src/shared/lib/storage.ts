import type { User, UserProgress, UserAnswer } from "@/entities";

const STORAGE_KEYS = {
	USER: "quiz_user",
	PROGRESS: "quiz_progress",
	ANSWERS: "quiz_answers",
} as const;

// 사용자 저장/로드
export const saveUser = (user: User): void => {
	localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const loadUser = (): User | null => {
	const userData = localStorage.getItem(STORAGE_KEYS.USER);
	if (!userData) return null;

	try {
		const user = JSON.parse(userData);
		// Date 객체 복원
		user.createdAt = new Date(user.createdAt);
		return user;
	} catch {
		return null;
	}
};

export const clearUser = (): void => {
	localStorage.removeItem(STORAGE_KEYS.USER);
};

// 진행상황 저장/로드
export const saveProgress = (progress: UserProgress): void => {
	const progressData = localStorage.getItem(STORAGE_KEYS.PROGRESS);
	const allProgress: UserProgress[] = progressData
		? JSON.parse(progressData)
		: [];

	const existingIndex = allProgress.findIndex(
		(p) =>
			p.userId === progress.userId && p.sessionId === progress.sessionId
	);

	if (existingIndex >= 0) {
		allProgress[existingIndex] = progress;
	} else {
		allProgress.push(progress);
	}

	localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
};

export const loadProgress = (
	userId: string,
	sessionId: string
): UserProgress | null => {
	const progressData = localStorage.getItem(STORAGE_KEYS.PROGRESS);
	if (!progressData) return null;

	try {
		const allProgress: UserProgress[] = JSON.parse(progressData);
		const progress = allProgress.find(
			(p) => p.userId === userId && p.sessionId === sessionId
		);

		if (progress) {
			// Date 객체 복원
			progress.startedAt = new Date(progress.startedAt);
			if (progress.completedAt) {
				progress.completedAt = new Date(progress.completedAt);
			}
		}

		return progress || null;
	} catch {
		return null;
	}
};

// 답변 저장/로드
export const saveAnswers = (answers: UserAnswer[]): void => {
	localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
};

export const loadAnswers = (
	userId: string,
	sessionId: string
): UserAnswer[] => {
	const answersData = localStorage.getItem(STORAGE_KEYS.ANSWERS);
	if (!answersData) return [];

	try {
		const allAnswers: UserAnswer[] = JSON.parse(answersData);
		return allAnswers
			.filter(
				(a) =>
					a.sessionId === sessionId &&
					// userId 체크 로직은 실제 구현에 따라 조정
					true
			)
			.map((answer) => ({
				...answer,
				submittedAt: new Date(answer.submittedAt),
			}));
	} catch {
		return [];
	}
};
