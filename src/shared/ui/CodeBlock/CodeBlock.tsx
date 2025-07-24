import classNames from "classnames";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  language: string;
  children: string;
  className?: string;
}

export const CodeBlock = ({
  language,
  children,
  className,
}: CodeBlockProps) => {
  return (
    <SyntaxHighlighter
     
			className={classNames(styles.container, className)}
     
			language={language}
			wrapLines
			showLineNumbers
			wrapLongLines
			useInlineStyles
		
    >
      {children}
    </SyntaxHighlighter>
  );
};
