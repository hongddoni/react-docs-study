import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TextInput, Button } from "@/shared/ui";
import type { User } from "@/entities";
import {
	canAccessSession,
	createDefaultUser,
	saveUser,
	loadUser,
	clearUser,
} from "@/shared/lib";
import styles from "./HomePage.module.css";

export const HomePage = () => {
	const [userName, setUserName] = useState("");
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const sessions = [
		{ id: "1", title: "1차시: 기초 문제", sessionNumber: 1 },
		{ id: "2", title: "2차시: 중급 문제", sessionNumber: 2 },
		{ id: "3", title: "3차시: 고급 문제", sessionNumber: 3 },
	];

	useEffect(() => {
		// 페이지 로드시 저장된 사용자 정보 확인
		const savedUser = loadUser();
		if (savedUser) {
			setCurrentUser(savedUser);
			setUserName(savedUser.name);
		}
	}, []);

	const handleCreateUser = () => {
		if (!userName.trim()) return;

		const user = createDefaultUser(userName.trim());
		setCurrentUser(user);
		saveUser(user);
	};

	const handleLogout = () => {
		setCurrentUser(null);
		setUserName("");
		clearUser();
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>문제풀이 학습 시스템</h1>
				<p className={styles.subtitle}>차시별로 문제를 풀어보세요</p>
			</div>

			{!currentUser ? (
				<div className={styles.userSection}>
					<TextInput
						value={userName}
						onChange={setUserName}
						label="이름"
						placeholder="이름을 입력하세요"
						required
					/>
					<Button
						onClick={handleCreateUser}
						disabled={!userName.trim()}
						fullWidth
					>
						시작하기
					</Button>
				</div>
			) : (
				<div className={styles.userSection}>
					<div className={styles.userInfo}>
						<h3>안녕하세요, {currentUser.name}님!</h3>
						<Button
							variant="secondary"
							size="small"
							onClick={handleLogout}
						>
							로그아웃
						</Button>
					</div>
				</div>
			)}

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

							{!isLocked && currentUser ? (
								<Link to={`/session/${session.id}`}>
									<Button variant="primary" size="medium">
										시작하기
									</Button>
								</Link>
							) : (
								<Button
									variant="secondary"
									size="medium"
									disabled
								>
									{!currentUser ? "로그인 필요" : "잠김"}
								</Button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
