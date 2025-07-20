import { createContext, useContext, useState } from "react";
import type { User } from "@/entities";

interface LoginContextType {
	currentUser: User | null;
	setCurrentUser: (user: User | null) => void;
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
}

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<LoginContext.Provider
			value={{
				currentUser,
				setCurrentUser,
				email,
				setEmail,
				password,
				setPassword,
			}}
		>
			{children}
		</LoginContext.Provider>
	);
};

export const useLogin = () => {
	const context = useContext(LoginContext);
	if (!context) {
		throw new Error("useLogin must be used within a LoginProvider");
	}
	return context;
};
