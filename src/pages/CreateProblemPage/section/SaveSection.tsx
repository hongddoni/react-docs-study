import styles from "./section.module.css";
import { useForm } from "../context/useForm";
import { Button } from "@/shared/ui";

export const SaveSection = () => {
	const { handleSave } = useForm();

	return (
		<div className={styles.saveSection}>
			<Button
				variant="primary"
				size="large"
				onClick={handleSave}
				fullWidth
			>
				문제 저장
			</Button>
		</div>
	);
};
