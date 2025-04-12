import { CSSProperties, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./styles.css";
import { getComptuedStyleProperties } from "@packages/utils";
import { parseTypescript, colorizeTypescriptTokens } from "@packages/parse-typescript";
import { parseYaml, colorizeYamlTokens } from "@packages/parse-yaml";
import { CopyToClipboard } from "@packages/copy-to-clipboard";

type SyntaxHighlighterProps = {
  code: string;
  highlightCode?: boolean;
  style?: CSSProperties;
  language?: "typescript" | "yaml";
} & Animated;

type Animated =
  | {
      withCursor?: boolean;
      animatedWriting?: boolean;
      pacing?: number;
    }
  | {
      withCursor?: never;
      animatedWriting?: never;
      pacing?: never;
    };

export const SyntaxHighlighter = ({
  code,
  highlightCode,
  withCursor,
  animatedWriting,
  pacing,
  style,
  language = "typescript",
}: SyntaxHighlighterProps) => {
  if (animatedWriting) {
    return <AnimatedCode code={code} withCursor={withCursor} pacing={pacing} style={style} />;
  }

  if (highlightCode) {
    if (language === "typescript") {
      const tokens = parseTypescript({ input: code });
      const highlighted = colorizeTypescriptTokens({ tokens });

      return (
        <div className="syntaxHighlighter" style={{ ...style, position: "relative" }}>
          <pre>
            <div style={{ position: "absolute", right: "10px" }}>
              <CopyToClipboard textToCopy={code} withIcons />
            </div>
            {highlighted.map((ele, index) => (
              <Fragment key={index}>{ele}</Fragment>
            ))}
            {withCursor ? <span className="terminalCursor">|</span> : null}
          </pre>
        </div>
      );
    } else {
      const tokens = parseYaml({ input: code });
      const highlighted = colorizeYamlTokens({ tokens });
      return (
        <div className="syntaxHighlighter" style={{ ...style, position: "relative" }}>
          <pre>
            <div style={{ position: "absolute", right: "10px" }}>
              <CopyToClipboard textToCopy={code} withIcons />
            </div>
            {highlighted.map((ele, index) => (
              <Fragment key={index}>{ele}</Fragment>
            ))}
            {withCursor ? <span className="terminalCursor">|</span> : null}
          </pre>
        </div>
      );
    }
  }

  return (
    <pre className="syntaxHighlighter" style={style}>
      {code}
      {withCursor ? <span className="terminalCursor">|</span> : null}
    </pre>
  );
};

const AnimatedCode = ({
  code,
  withCursor,
  pacing = 100,
  style,
}: Omit<SyntaxHighlighterProps, "animatedWriting">) => {
  const amountOfLines = useRef<number>(1);
  const [displayedCode, setDisplayedCode] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIndex = useRef<number>(0);
  const ref = useRef<HTMLPreElement>(null);
  const [potentialHeight, setPotentialHeight] = useState(0);
  const currentCode = useRef<string>(`${amountOfLines.current} `);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const { lineHeight } = getComptuedStyleProperties({
      element: ref.current,
      properties: ["lineHeight"],
    });
    const amountOfLines = code.split("\n").length;
    const numericLineHeight = parseFloat(lineHeight);
    setPotentialHeight(numericLineHeight * amountOfLines);
  }, [code, style]);

  useEffect(() => {
    if (cursorIndex.current === 0 || currentCode.current === code) {
      return;
    }

    cursorIndex.current = 0;
    amountOfLines.current = 1;
    currentCode.current = `${amountOfLines.current} `;
    setDisplayedCode("");
  }, [code]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (cursorIndex.current === code.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        return;
      }

      let splitCode = code.slice(cursorIndex.current, cursorIndex.current + 6);
      cursorIndex.current += splitCode.length;
      let transformedSplitCode = "";

      for (let i = 0; i < splitCode.length; i++) {
        const char = splitCode[i];
        if (char === "\n") {
          amountOfLines.current++;
          transformedSplitCode += `\n${amountOfLines.current} `;
        } else {
          transformedSplitCode += char;
        }
      }

      currentCode.current = currentCode.current + transformedSplitCode;
      setDisplayedCode(currentCode.current);
    }, pacing);

    return () => {
      if (!intervalRef.current) {
        return;
      }

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [code, pacing]);

  return (
    <pre
      ref={ref}
      className="syntaxHighlighter"
      style={
        style?.height
          ? style
          : { ...style, height: potentialHeight > 0 ? `${potentialHeight}px` : undefined }
      }
    >
      {displayedCode}
      {withCursor ? <span className="terminalCursor">|</span> : null}
    </pre>
  );
};
