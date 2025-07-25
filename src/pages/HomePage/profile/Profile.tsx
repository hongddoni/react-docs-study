import { supabase } from "@/shared/api";
import { checkIsManager, clearUser, saveUser } from "@/shared/lib";
import { Button, TextInput } from "@/shared/ui";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../LoginProvider";
import styles from "./Profile.module.css";

export const Profile = () => {
  const { currentUser, setCurrentUser } = useLogin();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const checkManagerStatus = async () => {
      if (currentUser) {
        const managerStatus = await checkIsManager(currentUser);
        console.log(managerStatus);
        setIsManager(managerStatus);
      } else {
        setIsManager(false);
      }
    };

    checkManagerStatus();
  }, [currentUser]);

  const handleUpdateName = useCallback(() => {
    if (!currentUser) return;
    supabase.auth.updateUser({
      data: { name },
    });
    setCurrentUser({
      id: currentUser.id,
      email: currentUser.email,
      createdAt: currentUser.createdAt,
      name,
    });
    saveUser({
      id: currentUser.id,
      name,
      createdAt: currentUser.createdAt,
    });
  }, [currentUser, name, setCurrentUser]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    clearUser();
  }, [setCurrentUser]);

  if (!currentUser?.name) {
    return (
      <div className={styles.userSection}>
        <TextInput
          value={name}
          onChange={setName}
          required
          label="이름"
          placeholder="이름을 입력하세요"
        />
        <Button onClick={handleUpdateName} fullWidth>
          이름 입력
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.userSection}>
      <div className={styles.userInfo}>
        <h3>안녕하세요, {currentUser?.name}님!</h3>
        <div className={styles.userActions}>
          {isManager && (
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate("/create-problem")}
            >
              문제 생성
            </Button>
          )}
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate("/ranking")}
          >
            랭킹보기
          </Button>
          <Button variant="secondary" size="small" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
};
