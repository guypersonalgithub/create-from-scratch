import { ArrowRight } from "@packages/icons";
import { convertObjectToString } from "@packages/object-utils";
import { SyntaxHighlighter, SyntaxHighlighterProps } from "@packages/syntax-highlighter";
import { convertObjectToYaml, convertYamlToObject } from "@packages/yaml";
import { useEffect, useRef, useState } from "react";

type ConvertTypescriptToYamlArgs = {
  code: Record<string, unknown>;
};

const convertTypescriptToYaml = ({ code }: ConvertTypescriptToYamlArgs) => {
  const input = convertObjectToString({ obj: code, stringifyValues: true });
  const output = convertObjectToYaml({ obj: code, includeNull: true });
  return { input, output };
};

type ConvertYamlToTypescriptArgs = {
  code: string;
};

const convertYamlToTypescript = ({ code }: ConvertYamlToTypescriptArgs) => {
  const input = code;
  const output = convertObjectToString({
    obj: convertYamlToObject({ str: code }),
    stringifyValues: true,
  });

  return { input, output };
};

type InputOutputProps = Omit<SyntaxHighlighterProps, "language" | "code"> & (Typescript | Yaml);

type Typescript = {
  language: "typescript";
  code: Record<string, unknown>;
};

type Yaml = {
  language: "yaml";
  code: string;
};

export const InputOutput = (props: InputOutputProps) => {
  const inputType = props.language;

  const { input, output } =
    inputType === "typescript"
      ? convertTypescriptToYaml({ code: props.code })
      : convertYamlToTypescript({ code: props.code });

  const outputLanguage = inputType === "typescript" ? "yaml" : "typescript";

  return (
    <InputOutputInternal {...props} input={input} output={output} outputLanguage={outputLanguage} />
  );
};

type InputOutputInternalProps = Omit<InputOutputProps, "code"> & {
  input: string;
  output: string;
  outputLanguage: "typescript" | "yaml";
};

const InputOutputInternal = ({
  input,
  output,
  outputLanguage,
  ...props
}: InputOutputInternalProps) => {
  const containerRef = useRef(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setIsNarrow(entry.contentRect.width <= 500);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", gap: "10px", flexDirection: isNarrow ? "column" : "row" }}
    >
      <SyntaxHighlighter
        {...props}
        highlightCode
        displayLanguage
        code={input}
        style={{ flex: 1 }}
      />
      <ArrowRight
        style={{
          alignSelf: "center",
          height: "50px",
          transition: "transform 0.3s ease",
          transform: isNarrow ? "rotate(90deg)" : "rotate(0deg)",
        }}
      />
      <SyntaxHighlighter
        {...props}
        highlightCode
        displayLanguage
        code={output}
        style={{ flex: 1 }}
        language={outputLanguage}
      />
    </div>
  );
};
