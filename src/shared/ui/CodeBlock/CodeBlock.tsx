import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Button } from "../Button";
import styles from "./CodeBlock.module.css";

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
        <Button
          variant="secondary"
          onClick={() => setFontSize(fontSize - 1)}
          fullWidth
        >
          -
        </Button>
        <Button
          variant="secondary"
          onClick={() => setFontSize(fontSize + 1)}
          fullWidth
        >
          +
        </Button>
      </div>
    </div>
  );
};
