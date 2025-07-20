import type { User } from "@/entities";
import { supabase } from "../api";

export const PERMISSIONS = {
	SESSION_1: "session_1",
	SESSION_2: "session_2",
	SESSION_3: "session_3",
	ADMIN: "admin",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const canAccessSession = async (
	user: User | null,
	sessionNumber: number
) => {
	if (!user) return false;

	const { data, error } = await supabase
		.from("access_permission")
		.select("*")
		.eq("id", user.id)
		.single();

	if (error) {
		console.error(error);
		return false;
	}

	if (!data) return false;

	// 마지막 세션부터 시작 가능
	const lastSession = data?.access.lastSession;

	if (sessionNumber > lastSession) return false;

	return true;
};

// 기본 사용자 생성 (개발용)
export const createDefaultUser = (name: string): User => ({
	id: Math.random().toString(36).substr(2, 9),
	name,
	createdAt: new Date().toISOString(),
});
