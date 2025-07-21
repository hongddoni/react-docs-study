import { canAccessSession } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "./LoginProvider";
import styles from "./Session.module.css";

export const Session = () => {
  const { currentUser } = useLogin();
  const [sessionAccess, setSessionAccess] = useState<Record<number, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  const sessions = useMemo(
    () => [
      { id: "1", title: "1차시: 기초 문제", sessionNumber: 1 },
      { id: "2", title: "2차시: 중급 문제", sessionNumber: 2 },
      { id: "3", title: "3차시: 고급 문제", sessionNumber: 3 },
    ],
    []
  );

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser) {
        setSessionAccess({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const accessMap: Record<number, boolean> = {};

      for (const session of sessions) {
        try {
          const hasAccess = await canAccessSession(
            currentUser,
            session.sessionNumber
          );
          accessMap[session.sessionNumber] = hasAccess;
        } catch (error) {
          console.error(`세션 ${session.sessionNumber} 권한 확인 실패:`, error);
          accessMap[session.sessionNumber] = false;
        }
      }

      setSessionAccess(accessMap);
      setIsLoading(false);
    };

    checkAccess();
  }, [currentUser, sessions]);

  if (isLoading) {
    return (
      <div className={styles.sessionList}>
        <h2 className={styles.sessionTitle}>학습 차시</h2>
        <div className={styles.loading}>권한 확인 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.sessionList}>
      <h2 className={styles.sessionTitle}>학습 차시</h2>
      {sessions.map((session) => {
        const hasAccess = sessionAccess[session.sessionNumber] ?? false;
        const isLocked = !hasAccess;

        return (
          <div
            key={session.id}
            className={`${styles.sessionCard} ${isLocked ? styles.locked : ""}`}
          >
            <div className={styles.sessionInfo}>
              <h3 className={styles.sessionName}>{session.title}</h3>
              {isLocked && <span className={styles.lockIcon}>🔒</span>}
            </div>

            {!isLocked && currentUser && currentUser.name ? (
              <>
                <Link to={`/session/${session.id}`}>
                  <Button variant="primary" size="medium">
                    시작하기
                  </Button>
                </Link>
              </>
            ) : (
              <Button variant="secondary" size="medium" disabled>
                {!currentUser ? "로그인 필요" : "잠김"}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
