import { createContext, useCallback, useState } from "react";
import type { QuestionForm } from "../types";

const initialForm: QuestionForm = {
  title: "",
  description: "",
  answerType: "multiple-choice",
  selectionMode: "single",
  options: [
    { id: "a", text: "" },
    { id: "b", text: "" },
  ],
  correctAnswer: [],
  explanation: "",
  sessionId: "2",
  code: "",
};

interface FormContextType {
  form: QuestionForm;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  initialForm: QuestionForm;
  onFormChange: (form: QuestionForm) => void;
}

export const FormContext = createContext<FormContextType | undefined>(
  undefined
);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [form, setForm] = useState<QuestionForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onFormChange = useCallback((form: QuestionForm) => {
    setForm(form);
  }, []);

  return (
    <FormContext.Provider
      value={{ form, initialForm, errors, setErrors, onFormChange }}
    >
      {children}
    </FormContext.Provider>
  );
};
