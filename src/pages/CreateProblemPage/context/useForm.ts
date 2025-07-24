import { createQuestion } from "@/shared/api";
import type { AnswerOption } from "@/shared/ui";
import { useCallback } from "react";
import type { QuestionForm } from "../types";
import { useFormContext } from "./useFormContext";

export const useForm = () => {
  const { form, onFormChange, errors, setErrors, initialForm } =
    useFormContext();

  const clearForm = useCallback(() => {
    onFormChange(initialForm);
  }, [onFormChange, initialForm]);

  const optionIdReOrder = useCallback((options: AnswerOption[]) => {
    return options.map((option, index) => ({
      ...option,
      id: String.fromCharCode(97 + index),
    }));
  }, []);

  const updateForm = useCallback(
    (field: keyof QuestionForm, value: QuestionForm[keyof QuestionForm]) => {
      if (field === "options") {
        value = optionIdReOrder(value as AnswerOption[]);
      }

      onFormChange({ ...form, [field]: value });
      // 에러 클리어
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    },
    [onFormChange, form, errors, setErrors, optionIdReOrder]
  );

  const addOption = useCallback(() => {
    const nextId = String.fromCharCode(97 + form.options.length); // a, b, c, d...
    updateForm("options", [...form.options, { id: nextId, text: "" }]);
  }, [form.options, updateForm]);

  const removeOption = useCallback(
    (index: number) => {
      if (form.options.length <= 2) return; // 최소 2개 유지

      updateForm(
        "options",
        form.options.filter((_, i) => i !== index)
      );
    },
    [form.options, updateForm]
  );

  const updateOption = useCallback(
    (index: number, text: string) => {
      updateForm(
        "options",
        form.options.map((option, i) =>
          i === index ? { ...option, text } : option
        )
      );
    },
    [form.options, updateForm]
  );

  const handleSave = async () => {
    if (!validateForm()) return;

    console.log(form);

    try {
      const newQuestion: QuestionForm = {
        title: form.title,
        description: form.description ?? "",
        answerType: form.answerType,
        selectionMode: form.selectionMode,
        options: form.answerType === "multiple-choice" ? form.options : [],
        correctAnswer: form.correctAnswer,
        explanation: form.explanation || "",
        sessionId: form.sessionId,
        code: form.code,
      };

      // Supabase에 저장
      const savedQuestion = await createQuestion(newQuestion);

      if (savedQuestion) {
        console.log("문제가 성공적으로 저장되었습니다:", savedQuestion);
        clearForm();
      } else {
        alert("문제 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("문제 저장 실패:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "문제 제목을 입력하세요";
    }

    if (!form.sessionId.trim()) {
      newErrors.sessionId = "세션 ID를 입력하세요";
    }

    if (form.answerType === "multiple-choice") {
      const emptyOptions = form.options.some((option) => !option.text.trim());
      if (emptyOptions) {
        newErrors.options = "모든 선택지를 입력하세요";
      }

      if (!form.correctAnswer || form.correctAnswer.length === 0) {
        newErrors.correctAnswer = "정답을 선택하세요";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    form,
    errors,
    clearForm,
    updateForm,
    removeOption,
    updateOption,
    handleSave,
    addOption,
  };
};
