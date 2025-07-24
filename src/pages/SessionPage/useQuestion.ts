import type {
	Question as QuestionType,
} from "@/entities/question/model/types";
import { useState } from "react";

export const useQuestion = () => {
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	return {
		questions,
		currentQuestionIndex,
        setQuestions,
        setCurrentQuestionIndex
	};
};
