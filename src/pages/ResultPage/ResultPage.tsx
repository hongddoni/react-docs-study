import type { QuestionResult } from "@/entities";
import { supabase } from "@/shared/api";
import { loadUser } from "@/shared/lib";
import { Button, Question } from "@/shared/ui";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./ResultPage.module.css";

interface LocationState {
  results: QuestionResult[];
  sessionTitle: string;
}

export const ResultPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [results, setResults] = useState<QuestionResult[]>([]);
  const [sessionTitle, setSessionTitle] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    // location state에서 결과 데이터 가져오기
    const state = location.state as LocationState;
    if (state?.results) {
      setResults(state.results);
      setSessionTitle(state.sessionTitle || `${sessionId}차시`);
    } else {
      // 결과 데이터가 없으면 홈으로 리다이렉트
      navigate("/", { replace: true });
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [sessionId, location.state, navigate]);

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = results.length;
  const score = Math.round((correctCount / totalCount) * 100);

  // 스코어 저장 로직
  const [isScoreSaved, setIsScoreSaved] = useState(false);
  useEffect(() => {
    const saveUserScore = async () => {
      if (isScoreSaved) return;

      const user = loadUser();
      if (!user || !sessionId) return;

      try {
        // 기존 점수 확인 (중복 방지)
        const { data: existingScore } = await supabase
          .from("user_score")
          .select("id")
          .eq("user_id", user.id)
          .eq("session_id", sessionId)
          .single();

        if (existingScore) {
          console.log("이미 저장된 점수가 있습니다.");
          setIsScoreSaved(true);
          return;
        }

        // 새 점수 저장
        const { data, error } = await supabase
          .from("user_score")
          .insert({
            user_id: user.id,
            session_id: sessionId,
            created_at: new Date().toISOString(),
            score: score,
          })
          .select()
          .single();

        if (error) {
          console.error("점수 저장 실패:", error);
          return;
        }

        console.log("점수가 성공적으로 저장되었습니다:", data);
        setIsScoreSaved(true);
      } catch (error) {
        console.error("점수 저장 중 오류 발생:", error);
      }
    };

    saveUserScore();
  }, [score, sessionId, isScoreSaved]);

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      const wasExpanded = newSet.has(index);
      if (wasExpanded) {
        newSet.delete(index);
        console.log(`카드 ${index + 1} 접힘`);
      } else {
        newSet.add(index);
        console.log(`카드 ${index + 1} 펼쳐짐`);
      }
      return newSet;
    });
  };

  const getCorrectAnswerDisplay = (
    correctAnswer: string[],
    question: any
  ): string => {
    if (question.options && question.answerType === "multiple-choice") {
      // 객관식: ID를 선택지 텍스트로 변환
      const correctTexts = correctAnswer.map(
        (id) => question.options?.find((opt: any) => opt.id === id)?.text || id
      );
      return correctTexts.join(", ");
    }

    // 주관식: 배열의 첫 번째 요소 (보통 하나만 있음)
    return correctAnswer.join(", ");
  };

  const getUserAnswerDisplay = (
    userAnswer: string | string[],
    question: any
  ): string => {
    if (Array.isArray(userAnswer)) {
      if (question.options) {
        const userTexts = userAnswer.map(
          (id) =>
            question.options?.find((opt: any) => opt.id === id)?.text || id
        );
        return userTexts.join(", ");
      }
      return userAnswer.join(", ");
    }

    if (question.options && question.answerType === "multiple-choice") {
      const userOption = question.options.find(
        (opt: any) => opt.id === userAnswer
      );
      return userOption ? userOption.text : userAnswer;
    }

    return userAnswer;
  };

  if (results.length === 0) {
    return null; // 데이터 로딩 중이거나 리다이렉트 중
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{sessionTitle} 결과</h1>
        <div className={styles.scoreSection}>
          <div className={styles.score}>
            <span className={styles.scoreValue}>{score}점</span>
            <span className={styles.scoreDetail}>
              ({correctCount}/{totalCount} 정답)
            </span>
          </div>
        </div>
        <div className={styles.homeButtonSection}>
          <Button variant="primary" onClick={handleGoHome}>
            홈으로
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {results.map((result, index) => {
          const isExpanded = expandedCards.has(index);

          return (
            <div key={index} className={styles.resultCard}>
              <div
                className={styles.questionHeader}
                onClick={() => toggleCard(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(index);
                  }
                }}
              >
                <div className={styles.headerContent}>
                  <span className={styles.questionCounter}>
                    문제 {index + 1} / {totalCount}
                  </span>
                  <span
                    className={`${styles.resultBadge} ${
                      result.isCorrect ? styles.correct : styles.incorrect
                    }`}
                  >
                    {result.isCorrect ? "정답" : "오답"}
                  </span>
                </div>
                <div className={styles.expandIcon}>
                  <span
                    className={
                      isExpanded ? styles.iconExpanded : styles.iconCollapsed
                    }
                  >
                    ▼
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.accordionContent}>
                  <div className={styles.questionContent}>
                    <Question
                      title={result.question.title}
                      description={result.question.description}
                    />
                  </div>
                  <div className={styles.answerSection}>
                    <div className={styles.answerItem}>
                      <h4 className={styles.answerLabel}>내 답안</h4>
                      <div
                        className={`${styles.answerValue} ${
                          result.isCorrect
                            ? styles.correctAnswer
                            : styles.wrongAnswer
                        }`}
                      >
                        {getUserAnswerDisplay(
                          result.userAnswer,
                          result.question
                        )}
                      </div>
                    </div>

                    {!result.isCorrect && (
                      <div className={styles.answerItem}>
                        <h4 className={styles.answerLabel}>정답</h4>
                        <div
                          className={`${styles.answerValue} ${styles.correctAnswer}`}
                        >
                          {getCorrectAnswerDisplay(
                            result.question.correctAnswer!,
                            result.question
                          )}
                        </div>
                      </div>
                    )}

                    {result.question.explanation && (
                      <div className={styles.explanationSection}>
                        <h4 className={styles.explanationLabel}>해설</h4>
                        <p className={styles.explanationText}>
                          {result.question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
