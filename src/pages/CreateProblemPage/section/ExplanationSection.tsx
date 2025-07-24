import { Textarea } from "@/shared/ui";
import { useForm } from "../context/useForm";
import styles from "./section.module.css";

export const ExplanationSection = () => {
  const { form, updateForm } = useForm();

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>해설</h2>
      <div className={styles.field}>
        <Textarea
          label="해설"
          value={form.explanation}
          onChange={(value) => updateForm("explanation", value)}
          placeholder="문제에 대한 해설을 입력하세요 (선택사항)"
        />
      </div>
    </div>
  );
};
