// import { ArrowRight, TagPage } from "@packages/icons";
import { convertObjectToString } from "@packages/object-utils";
import { SyntaxHighlighterProps } from "@packages/syntax-highlighter";
import { StyledSyntaxHighlighter } from "./StyledSyntaxHighlighter";
import { convertObjectToYaml, convertYamlToObject } from "@packages/yaml";
import { useEffect, useRef, useState } from "react";
import "./InputOutput.css";

type ConvertTypescriptToYamlArgs = {
  code: Record<string, unknown>;
};

const convertTypescriptToYaml = ({ code }: ConvertTypescriptToYamlArgs) => {
  const input = convertObjectToString({ obj: code, stringifyValues: true });
  const output = convertObjectToYaml({ obj: code });
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
  const isTypescript = inputType === "typescript";

  const { input, output } = isTypescript
    ? convertTypescriptToYaml({ code: props.code })
    : convertYamlToTypescript({ code: props.code });

  const outputLanguage = isTypescript ? "yaml" : "typescript";

  const inputLabel = isTypescript ? "Javascript" : "YAML";
  const outputLabel = isTypescript ? "YAML" : "Javascript";

  return (
    <InputOutputInternal
      {...props}
      input={input}
      output={output}
      outputLanguage={outputLanguage}
      inputLabel={inputLabel}
      outputLabel={outputLabel}
    />
  );
};

type InputOutputInternalProps = Omit<InputOutputProps, "code"> & {
  input: string;
  output: string;
  outputLanguage: "typescript" | "yaml";
  inputLabel: string;
  outputLabel: string;
};

const InputOutputInternal = ({
  input,
  output,
  outputLanguage,
  inputLabel,
  outputLabel,
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
    <div ref={containerRef} style={{ padding: "8px" }}>
      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          paddingBottom: "8px",
          marginBottom: "8px",
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
          borderBottom: "1px solid var(--theme-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <TagPage size={20} />
          <span style={{ fontWeight: "bold", fontSize: "14px" }}>{inputLabel}</span>
        </div>
        <ArrowRight
          size={20}
          style={{
            transition: "transform 0.3s ease",
            transform: isNarrow ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <TagPage size={20} />
          <span style={{ fontWeight: "bold", fontSize: "14px" }}>{outputLabel}</span>
        </div>
      </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: isNarrow ? "column" : "row",
          gap: 0,
          position: "relative",
        }}
      >
        <div
          className={isNarrow ? "divider-line-bottom" : "divider-line-right"}
          style={{ flex: 1, overflow: "hidden" }}
        >
          <StyledSyntaxHighlighter
            {...props}
            highlightCode
            code={input}
            variant={props.language === "typescript" ? "dark" : "green"}
          />
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <StyledSyntaxHighlighter
            {...props}
            highlightCode
            code={output}
            language={outputLanguage}
            variant={outputLanguage === "typescript" ? "dark" : "green"}
          />
        </div>
      </div>
    </div>
  );
};
