// import { ArrowRight, TagPage } from "@packages/icons";
import { convertObjectToString } from "@packages/object-utils";
import { type SyntaxHighlighterProps } from "@packages/syntax-highlighter";
import { StyledSyntaxHighlighter } from "./StyledSyntaxHighlighter";
import { convertObjectToYaml, convertYamlToObject } from "@packages/yaml";
import { useEffect, useRef, useState } from "react";
import { dynatic } from "../dynatic-css.config";
import { combineStringsWithSpaces } from "@packages/utils";

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
    <div
      ref={containerRef}
      className={dynatic`
        padding: 8px;
      `}
    >
      {/* <div
        className={dynatic`
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 8px;
          margin-bottom: 8px;
          color: ${(config) => config.colors.mainColor};
          transition: ${(config) => config.shared.defaultTransition};
          border-bottom: ${(config) => config.colors.mainColor};
        `}
      >
        <div
          className={dynatic`
            display: flex;
            align-items: center;
            gap: 4px;
          `}
        >
          <TagPage className={dynatic`
            width: 20px;
            height: 20px;
          `} />
          <span
            className={dynatic`
              font-weight: bold;
              font-size: 14px;
            `}
          >
            {inputLabel}
          </span>
        </div>
        <ArrowRight
          className={dynatic`
            width: 20px;
            height: 20px;
          `}
          style={{
            transition: "transform 0.3s ease",
            transform: isNarrow ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
        <div
          className={dynatic`
            display: flex;
            align-items: center;
            gap: 4px;
          `}
        >
          <TagPage className={dynatic`
            width: 20px;
            height: 20px;
          `} />
          <span
            className={dynatic`
              font-weight: bold;
              font-size: 14px;
            `}
          >
            {outputLabel}
          </span>
        </div>
      </div> */}
      <div
        className={dynatic`
          display: flex;
          gap: 0;
          position: relative;
        `}
        style={{
          flexDirection: isNarrow ? "column" : "row",
        }}
      >
        <div
          className={combineStringsWithSpaces(
            dynatic`
              position: relative;
              flex: 1;
              overflow: hidden;

              &::before {
                content: "";
                position: absolute;
                bottom: 0;
                right: 0;
              }
            `,
            isNarrow
              ? dynatic`
                  &::before {
                    left: 0;
                    height: 1px;
                    background: linear-gradient(
                      to right,
                      transparent 0%,
                      #e5e7eb 20%,
                      #e5e7eb 80%,
                      transparent 100%
                    );
                  }
                `
              : dynatic`
                  &::before {
                    top: 0;
                    width: 1px;
                    background: linear-gradient(
                      to bottom,
                      transparent 0%,
                      #e5e7eb 20%,
                      #e5e7eb 80%,
                      transparent 100%
                    );
                  }
                `,
          )}
        >
          <StyledSyntaxHighlighter
            {...props}
            highlightCode
            code={input}
            variant={props.language === "typescript" ? "dark" : "green"}
          />
        </div>
        <div
          className={dynatic`
            flex: 1;
            overflow: hidden;
          `}
        >
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
