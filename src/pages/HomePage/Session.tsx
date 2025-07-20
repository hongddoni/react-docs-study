import { Link } from "react-router-dom";
import styles from "./Session.module.css";
import { Button } from "@/shared/ui";
import { canAccessSession } from "@/shared/lib";
import { useLogin } from "./LoginProvider";

export const Session = () => {
	const { currentUser } = useLogin();
	const sessions = [
		{ id: "1", title: "1차시: 기초 문제", sessionNumber: 1 },
		{ id: "2", title: "2차시: 중급 문제", sessionNumber: 2 },
		{ id: "3", title: "3차시: 고급 문제", sessionNumber: 3 },
	];
	return (
		<div className={styles.sessionList}>
			<h2 className={styles.sessionTitle}>학습 차시</h2>
			{sessions.map((session) => {
				const hasAccess = canAccessSession(
					currentUser,
					session.sessionNumber
				);
				const isLocked = !hasAccess;

				return (
					<div
						key={session.id}
						className={`${styles.sessionCard} ${
							isLocked ? styles.locked : ""
						}`}
					>
						<div className={styles.sessionInfo}>
							<h3 className={styles.sessionName}>
								{session.title}
							</h3>
							{isLocked && (
								<span className={styles.lockIcon}>🔒</span>
							)}
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
