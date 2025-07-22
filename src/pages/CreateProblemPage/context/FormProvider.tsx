import { createContext, useState } from "react";
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
};

interface FormContextType {
	form: QuestionForm;
	setForm: (form: QuestionForm) => void;
	errors: Record<string, string>;
	setErrors: (errors: Record<string, string>) => void;
	initialForm: QuestionForm;
}

export const FormContext = createContext<FormContextType | undefined>(
	undefined
);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
	const [form, setForm] = useState<QuestionForm>(initialForm);
	const [errors, setErrors] = useState<Record<string, string>>({});

	return (
		<FormContext.Provider
			value={{ form, setForm, initialForm, errors, setErrors }}
		>
			{children}
		</FormContext.Provider>
	);
};
