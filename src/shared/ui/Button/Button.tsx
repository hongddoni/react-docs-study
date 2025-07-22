import type { FC } from "react";
import styles from "./Button.module.css";

export interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "small" | "medium" | "large";
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
	children,
	onClick,
	variant = "primary",
	size = "medium",
	disabled = false,
	type = "button",
	fullWidth = false,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${styles.button} ${styles[variant]} ${styles[size]} ${
				fullWidth ? styles.fullWidth : ""
			}`}
		>
			{children}
		</button>
	);
};
