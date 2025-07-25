import { CodeBlock, Textarea, TextInput } from "@/shared/ui";
import { useForm } from "../context/useForm";
import styles from "./section.module.css";

export const BasicSection = () => {
  const { form, errors, updateForm } = useForm();
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>기본 정보</h2>

      <div className={styles.field}>
        <TextInput
          label="문제 제목"
          value={form.title}
          onChange={(value) => updateForm("title", value)}
          placeholder="문제 제목을 입력하세요"
          required
          error={errors.title}
        />
      </div>

      <div className={styles.field}>
        <TextInput
          label="문제 설명"
          value={form.description}
          onChange={(value) => updateForm("description", value)}
          placeholder="문제에 대한 추가 설명 (선택사항)"
        />
      </div>

      <div className={styles.codeField}>
        <Textarea
          label="코드"
          value={form.code}
          onChange={(value) => updateForm("code", value)}
          placeholder="코드를 입력하세요"
        />
        <CodeBlock language="typescript">{form.code}</CodeBlock>
      </div>

      <div className={styles.field}>
        <TextInput
          label="세션 ID"
          value={form.sessionId}
          onChange={(value) => updateForm("sessionId", value)}
          placeholder="문제가 속할 세션 ID를 입력하세요"
          required
          error={errors.sessionId}
        />
      </div>
    </div>
  );
};
