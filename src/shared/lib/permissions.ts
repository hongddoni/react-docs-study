import type { User } from "@/entities";

export const PERMISSIONS = {
	SESSION_1: "session_1",
	SESSION_2: "session_2",
	SESSION_3: "session_3",
	ADMIN: "admin",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const hasPermission = (
	user: User | null,
	requiredPermission: string
): boolean => {
	if (!user) return false;
	if (user?.permissions?.includes(PERMISSIONS.ADMIN)) return true;
	return user?.permissions?.includes(requiredPermission);
};

export const canAccessSession = (
	user: User | null,
	sessionNumber: number
): boolean => {
	if (!user) return false;

	// 관리자는 모든 세션에 접근 가능

	// 기본적으로 1차시는 모두 접근 가능
	if (sessionNumber === 1) return true;

	// 2차시 이상은 해당 권한이 필요
	const requiredPermission = `session_${sessionNumber}`;
	// return user.permissions.includes(requiredPermission);
	//todo: 권한 체크 로직 추가
	return true;
};

// 기본 사용자 생성 (개발용)
export const createDefaultUser = (name: string): User => ({
	id: Math.random().toString(36).substr(2, 9),
	name,
	createdAt: new Date().toISOString(),
});
