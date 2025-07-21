import { supabase } from "@/shared/api";
import { Button, TextInput } from "@/shared/ui";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";

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
  }, [email, password, confirmPassword]);

  const insertSession = useCallback(async (id: string) => {
    await supabase.from("access_permission").insert({
      id,
      access: {
        lastSession: 1,
        isManager: false,
      },
    });
  }, []);

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
      const { data, error } = await supabase.auth.signUp({
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

      if (data.user) {
        await insertSession(data.user.id);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }, [email, hasUser, insertSession, navigate, password]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!disabled) {
        onSignUp();
      }
    },
    [disabled, onSignUp]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1>가입하기</h1>
      <span className={styles.notice}>
        supabase auth로 관리되며 비밀번호는 암호화되어 저장됩니다.
      </span>
      <TextInput
        label="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={setEmail}
        autocomplete="email"
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
        autocomplete="new-password"
        required
      />
      <TextInput
        label="비밀번호 확인"
        placeholder="비밀번호를 입력하세요"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autocomplete="new-password"
        error={
          confirmPassword && password !== confirmPassword
            ? "비밀번호가 일치하지 않습니다."
            : ""
        }
        required
      />
      <Button type="submit" disabled={disabled}>
        가입하기
      </Button>
    </form>
  );
};
