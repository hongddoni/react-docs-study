import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styles from "./CodeBlock.module.css";
import { Slider } from "../Slider";

interface CodeBlockProps {
	language: string;
	children: string;
}

export const CodeBlock = ({ language, children }: CodeBlockProps) => {
	const [fontSize, setFontSize] = useState(10);
	return (
		<div className={styles.container}>
			<SyntaxHighlighter
				language={language}
				customStyle={{ fontSize: `${fontSize}px`, maxHeight: "50vh" }}
			>
				{children}
			</SyntaxHighlighter>
			<div className={styles.controls}>
				<Slider value={fontSize} onChange={setFontSize} />
			</div>
		</div>
	);
};
