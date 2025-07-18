export interface User {
	id: string;
	name: string;
	email?: string;
	permissions: string[];
	createdAt: Date;
}

export interface UserSession {
	user: User;
	isAuthenticated: boolean;
	permissions: string[];
}
