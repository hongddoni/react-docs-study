import { Title } from "@/shared/ui";
import styles from "./CreateProblemPage.module.css";
import { FormProvider } from "./context";
import { BasicSection } from "./section";
import { AnswerSection } from "./section/AnswerSection";
import { MultipleSection } from "./section/MultipleSection";
import { ShortAnswerSection } from "./section/ShortAnswerSection";
import { ExplanationSection } from "./section/ExplanationSection";
import { SaveSection } from "./section/SaveSection";

export const CreateProblemPage = () => {
	return (
		<FormProvider>
			<div className={styles.container}>
				<Title hasBackButton>문제 생성</Title>

				<div className={styles.formContainer}>
					<BasicSection />
					<AnswerSection />

					<MultipleSection />
					<ShortAnswerSection />

					<ExplanationSection />

					<SaveSection />
				</div>
			</div>
		</FormProvider>
	);
};
