import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
	language: string;
	children: string;
}

export const CodeBlock = ({ language, children }: CodeBlockProps) => {
	return (
		<SyntaxHighlighter className={styles.container} language={language}>
			{children}
		</SyntaxHighlighter>
	);
};
