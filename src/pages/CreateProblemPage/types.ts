import type { AnswerOption, AnswerType, SelectionMode } from "@/shared/ui";

export interface QuestionForm {
  title: string;
  description: string;
  answerType: AnswerType;
  selectionMode: SelectionMode;
  options: AnswerOption[];
  correctAnswer: string[];
  explanation: string;
  sessionId: string;
  code: string;
}
