import type { QuestionResult } from "@/entities";
import { useState } from "react";

export const useAnswer = () => {
	const [answers, setAnswers] = useState<Record<string, string | string[]>>(
		{}
	);
	const [results, setResults] = useState<QuestionResult[]>([]);

	return {
		answers,
		results,
		setAnswers,
		setResults,
	};
};
