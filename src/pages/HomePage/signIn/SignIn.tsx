import styles from "./SignIn.module.css";
import { TextInput } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { supabase } from "@/shared/api";
import { useLogin } from "../LoginProvider";
import { saveUser } from "@/shared/lib";

export const SignIn = () => {
	const { email, password, setEmail, setPassword, setCurrentUser } =
		useLogin();
	const signIn = useCallback(async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error && error.code === "invalid_credentials") {
			alert("이메일 또는 비밀번호가 일치하지 않습니다.");
			return;
		}

		if (data.user) {
			setCurrentUser({
				id: data.user.id,
				name: data.user.user_metadata.name,
				createdAt: data.user.created_at,
			});

			if (data.user.user_metadata.name) {
				saveUser({
					id: data.user.id,
					name: data.user.user_metadata.name,
					createdAt: data.user.created_at,
				});
			}
		}
	}, [email, password]);

	return (
		<div className={styles.userSection}>
			<TextInput
				value={email}
				onChange={setEmail}
				label="이메일"
				placeholder="이메일을 입력하세요"
				required
			/>
			<TextInput
				value={password}
				onChange={setPassword}
				label="비밀번호"
				type="password"
				placeholder="비밀번호를 입력하세요"
				required
			/>
			<Button
				onClick={signIn}
				disabled={!email.trim() || !password.trim()}
				fullWidth
			>
				시작하기
			</Button>
			<Link to={"/signup"} className={styles.signupButton}>
				<Button variant="secondary" size="medium" fullWidth>
					가입하러 가기
				</Button>
			</Link>
		</div>
	);
};
