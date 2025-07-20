import { Login } from "./Login";
import styles from "./HomePage.module.css";
import { Session } from "./Session";
import { LoginProvider } from "./LoginProvider";

export const HomePage = () => {
	return (
		<LoginProvider>
			<div className={styles.container}>
				<div className={styles.header}>
					<h1 className={styles.title}>문제풀이 학습 시스템</h1>
					<p className={styles.subtitle}>
						차시별로 문제를 풀어보세요
					</p>
				</div>
				<Login />
				<Session />
			</div>
		</LoginProvider>
	);
};
