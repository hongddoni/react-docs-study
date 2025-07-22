import styles from "./Radio.module.css";

interface Props {
	children: React.ReactNode;
	checked?: boolean;
	value: string;
	name?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Radio = ({ children, checked, value, name, onChange }: Props) => {
	return (
		<label className={styles.radioLabel}>
			<input
				type="radio"
				checked={checked}
				value={value}
				name={name}
				onChange={onChange}
			/>
			<span>{children}</span>
		</label>
	);
};
