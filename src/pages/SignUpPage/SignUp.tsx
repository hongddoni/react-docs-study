import { supabase } from "@/shared/api";
import styles from "./SignUp.module.css";
import { TextInput } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();

	const disabled = useMemo(() => {
		return (
			!email.trim() ||
			!password.trim() ||
			!confirmPassword.trim() ||
			password !== confirmPassword
		);
	}, [name, email, password, confirmPassword]);

	const hasUser = useCallback(async () => {
		const { data } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return data.user;
	}, [email, password]);

	const onSignUp = useCallback(async () => {
		const isExisting = await hasUser();
		if (isExisting) {
			alert("이미 존재하는 이메일입니다.");
			return;
		}

		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) {
				if (error.code === "user_already_exists") {
					alert("이미 존재하는 이메일입니다.");
					return;
				}

				alert(error.message);
				return;
			}

			await supabase.auth.updateUser({
				data: { name },
			});
			navigate("/");
		} catch (error) {
			console.error(error);
		}
	}, [email, password]);

	return (
		<div className={styles.container}>
			<h1>가입하기</h1>
			<TextInput
				label="이메일"
				type="email"
				placeholder="이메일을 입력하세요"
				value={email}
				onChange={setEmail}
				error={
					email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
						? "이메일 형식이 올바르지 않습니다."
						: ""
				}
				required
			/>
			<TextInput
				label="비밀번호"
				placeholder="비밀번호를 입력하세요"
				type="password"
				value={password}
				onChange={setPassword}
				required
			/>
			<TextInput
				label="비밀번호 확인"
				placeholder="비밀번호를 입력하세요"
				type="password"
				value={confirmPassword}
				onChange={setConfirmPassword}
				error={
					confirmPassword && password !== confirmPassword
						? "비밀번호가 일치하지 않습니다."
						: ""
				}
				required
			/>
			<Button disabled={disabled} onClick={onSignUp}>
				가입하기
			</Button>
		</div>
	);
};
