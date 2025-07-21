import { loadUser } from "@/shared/lib";
import { useEffect } from "react";
import styles from "./Login.module.css";
import { useLogin } from "./LoginProvider";
import { Profile } from "./profile/Profile";
import { SignIn } from "./signIn/SignIn";

export const Login = () => {
  const { currentUser, setCurrentUser } = useLogin();

  useEffect(() => {
    // 페이지 로드시 저장된 사용자 정보 확인
    const savedUser = loadUser();

    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, [setCurrentUser]);

  return (
    <div className={styles.container}>
      {!currentUser ? <SignIn /> : <Profile />}
    </div>
  );
};
