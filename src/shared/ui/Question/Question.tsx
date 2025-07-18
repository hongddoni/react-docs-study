import type { FC } from "react";
import styles from "./Question.module.css";

export interface QuestionProps {
	title: string;
	description?: string;
	imageUrl?: string;
	questionNumber?: number;
	totalQuestions?: number;
}

export const Question: FC<QuestionProps> = ({
	title,
	description,
	imageUrl,
	questionNumber,
	totalQuestions,
}) => {
	return (
		<div className={styles.container}>
			{questionNumber && totalQuestions && (
				<div className={styles.header}>
					<span className={styles.questionCounter}>
						문제 {questionNumber} / {totalQuestions}
					</span>
				</div>
			)}

			<div className={styles.content}>
				<h2 className={styles.title}>{title}</h2>

				{description && (
					<p className={styles.description}>{description}</p>
				)}

				{imageUrl && (
					<div className={styles.imageContainer}>
						<img
							src={imageUrl}
							alt="문제 이미지"
							className={styles.image}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
