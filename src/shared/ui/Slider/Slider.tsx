import styles from "./Slider.module.css";

interface Props {
	value: number;
	onChange: (value: number) => void;
}

export const Slider = ({ value, onChange }: Props) => {
	return (
		<input
			min={10}
			max={25}
			step={1}
			type="range"
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
			className={styles.slider}
		/>
	);
};
