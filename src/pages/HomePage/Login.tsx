import styles from "./Login.module.css";
import { useEffect } from "react";
import { loadUser } from "@/shared/lib";
import { useLogin } from "./LoginProvider";
import { SignIn } from "./signIn/SignIn";
import { Profile } from "./profile/Profile";

export const Login = () => {
	const { currentUser, setCurrentUser } = useLogin();

	useEffect(() => {
		// 페이지 로드시 저장된 사용자 정보 확인
		const savedUser = loadUser();

		if (savedUser) {
			setCurrentUser(savedUser);
		}
	}, []);

	return (
		<div className={styles.container}>
			{!currentUser ? <SignIn /> : <Profile />}
		</div>
	);
};
