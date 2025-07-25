import type { FC } from "react";
import { CodeBlock } from "../CodeBlock";
import styles from "./Question.module.css";

export interface QuestionProps {
  title: string;
  description?: string;
  questionNumber?: number;
  totalQuestions?: number;
  code?: string;
}

export const Question: FC<QuestionProps> = ({
  title,
  description,
  questionNumber,
  totalQuestions,
  code,
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
      {code && <CodeBlock language="typescript">{code}</CodeBlock>}

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
};
