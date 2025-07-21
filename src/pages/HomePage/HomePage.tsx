import styles from "./HomePage.module.css";
import { Login } from "./Login";
import { LoginProvider } from "./LoginProvider";
import { Session } from "./Session";

export const HomePage = () => {
  return (
    <LoginProvider>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>React Docs Quiz</h1>
          <p className={styles.subtitle}>차시별로 문제를 풀어보세요</p>
        </div>
        <Login />
        <Session />
      </div>
    </LoginProvider>
  );
};
