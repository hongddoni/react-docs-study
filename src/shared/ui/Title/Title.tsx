import { BackHomeButton } from "@/shared/ui/Button";
import s from "./Title.module.css";

interface Props {
    hasBackButton?: boolean;
    children: React.ReactNode;
}

export const Title = ({ hasBackButton, children }: Props) => {
	return (
		<h1 className={s.title}>
			{hasBackButton && <BackHomeButton />}
			{children}
		</h1>
	);
};
