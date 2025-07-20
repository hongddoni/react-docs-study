export interface User {
	id: string;
	name: string;
	email?: string;
	createdAt: string;
}

export interface UserSession {
	user: User;
	isAuthenticated: boolean;
}
