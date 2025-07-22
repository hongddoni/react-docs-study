import { Button } from "@/shared/ui";
import { useNavigate } from "react-router-dom";

export const BackHomeButton = () => {
	const navigate = useNavigate();

	return (
		<Button variant="ghost" size="small" onClick={() => navigate("/")}>
			← 홈으로
		</Button>
	);
};
