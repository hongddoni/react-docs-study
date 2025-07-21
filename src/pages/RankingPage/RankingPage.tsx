import { supabase } from "@/shared/api";
import { useEffect, useState } from "react";
import styles from "./RankingPage.module.css";

interface RankingData {
  id: string;
  score: number;
  userName?: string;
}

export const RankingPage = () => {
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        // 1. 랭킹 데이터 가져오기 (user_id 포함)
        const { data: rankingData, error: rankingError } = await supabase
          .from("user_score")
          .select("id, score, user_id")
          .order("score", { ascending: false });

        if (rankingError) {
          console.error("랭킹 데이터 로드 실패:", rankingError);
          return;
        }

        // 2. 각 사용자의 정보를 개별적으로 가져오기
        const rankingWithNames = await Promise.all(
          (rankingData || []).map(async (item) => {
            try {
              // 현재 로그인한 사용자 정보 가져오기 (임시 방법)
              // 실제로는 서버에서 사용자 정보를 함께 가져오는 것이 좋습니다
              const {
                data: { user },
              } = await supabase.auth.getUser();

              let userName = "익명";
              if (user && user.id === item.user_id) {
                userName = user.user_metadata?.name || "익명";
              } else {
                // 다른 사용자의 경우, 실제로는 서버에서 사용자 정보를 가져와야 합니다
                // 현재는 임시로 '사용자' + ID로 표시
                userName = `사용자 ${item.user_id.slice(0, 8)}`;
              }

              return {
                ...item,
                userName,
              };
            } catch (error) {
              console.error("사용자 정보 가져오기 실패:", error);
              return {
                ...item,
                userName: "익명",
              };
            }
          })
        );

        setRankingData(rankingWithNames);
      } catch (error) {
        console.error("랭킹 데이터 로드 중 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.ranking}>
        <h1>랭킹</h1>
        <p>랭킹을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.ranking}>
      <h1>랭킹</h1>
      <div className={styles.rankingList}>
        {rankingData.map((item, index) => (
          <div key={item.id} className={styles.rankingItem}>
            <span className={styles.rank}>{index + 1}등- </span>
            <span className={styles.userName}>{item.userName}</span>
            <span className={styles.score}> {item.score}점</span>
          </div>
        ))}
      </div>
    </div>
  );
};
