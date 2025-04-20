import { CSSProperties, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./styles.css";
import { getComptuedStyleProperties } from "@packages/utils";
import { CopyToClipboard } from "@packages/copy-to-clipboard";
import { colorizeTokens } from "./colorizeTokens";
import { GenericBaseToken, TokenMaps } from "./types";
import { supportedLanguages, SupportedLanguages } from "./languages";

type SyntaxHighlighterProps<T extends SupportedLanguages = "typescript"> = {
  code: string;
  style?: CSSProperties;
  language?: SupportedLanguages;
  copyToClipboard?: boolean;
} & HighlightCode<T> &
  Animated;

type HighlightCode<T extends SupportedLanguages = "typescript"> =
  | {
      highlightCode?: boolean;
      customizeColors?: (args: {
        tokens: GenericBaseToken<T>[];
        baseColors: Record<TokenMaps[T], string>;
      }) => {
        customBaseColors?: Partial<Record<TokenMaps[T], string>>;
        cellTypeRebranding?: Record<number, TokenMaps[T]>;
        customCellColors?: Record<number, string>;
      };
    }
  | {
      highlightCode?: never;
      customizeColors?: never;
    };

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

export const SyntaxHighlighter = <T extends SupportedLanguages = "typescript">({
  code,
  highlightCode,
  withCursor,
  animatedWriting,
  pacing,
  style,
  language = "typescript",
  copyToClipboard = true,
  customizeColors,
}: SyntaxHighlighterProps<T>) => {
  if (animatedWriting) {
    return <AnimatedCode code={code} withCursor={withCursor} pacing={pacing} style={style} />;
  }

  if (highlightCode) {
    const { callback, baseColors } = supportedLanguages[language] as {
      callback: (args: { input: string }) => GenericBaseToken<T>[];
      baseColors: Record<TokenMaps[T], string>;
    };

    const tokens = callback({ input: code }) as GenericBaseToken<T>[];
    const {
      customBaseColors = {},
      cellTypeRebranding = {},
      customCellColors = {},
    } = customizeColors?.({
      tokens,
      baseColors,
    }) ?? {};
    const highlighted = colorizeTokens({
      tokens,
      baseColors: { ...baseColors, ...customBaseColors },
      cellTypeRebranding,
      customCellColors,
    });

    return (
      <div
        className="syntaxHighlighter"
        style={{ ...style, position: "relative", overflow: "auto" }}
      >
        <pre>
          {copyToClipboard ? (
            <div style={{ position: "absolute", right: "10px" }}>
              <CopyToClipboard textToCopy={code} withIcons style={{ color: "white" }} />
            </div>
          ) : null}
          {highlighted.map((ele, index) => (
            <Fragment key={index}>{ele}</Fragment>
          ))}
          {withCursor ? <span className="terminalCursor">|</span> : null}
        </pre>
      </div>
    );
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
