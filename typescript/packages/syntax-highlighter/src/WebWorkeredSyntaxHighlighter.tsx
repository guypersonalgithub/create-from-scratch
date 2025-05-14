import { SupportedLanguages } from "./languages";
import { StandardSyntaxHighlighterProps, HighlightedCode } from "./SyntaxHighlighter";
import { colorizeTokens } from "./colorizeTokens";
import { GenericBaseToken, TokenMaps } from "./types";
import { Fragment, useEffect, useRef, useState } from "react";
import { TopRightSection } from "./TopRightSection";
import HighlightWorker from "./webWorker?worker";

type WebWorkeredSyntaxHighlighterProps<T extends SupportedLanguages = "typescript"> =
  StandardSyntaxHighlighterProps & Omit<HighlightedCode<T>, "highlightCode" | "withWebWorker">;

export const WebWorkeredSyntaxHighlighter = <T extends SupportedLanguages = "typescript">({
  code,
  style,
  language = "typescript",
  copyToClipboard = true,
  customizeColors,
  addLineCounter = true,
  displayLanguage,
}: WebWorkeredSyntaxHighlighterProps<T>) => {
  const [tokens, setTokens] = useState<GenericBaseToken<T>[] | null>(null);
  const [baseColors, setBaseColors] = useState<Record<TokenMaps[T], string>>(
    {} as Record<TokenMaps[T], string>,
  );
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    workerRef.current = new HighlightWorker();

    if (!workerRef.current) {
      return;
    }

    workerRef.current.onmessage = (e) => {
      const { tokens, baseColors } = e.data;
      setTokens(tokens);
      setBaseColors(baseColors);
    };

    workerRef.current.postMessage({ code, language });

    return () => {
      workerRef.current?.terminate();
    };
  }, [code, language]);

  if (!tokens) {
    return (
      <div
        className="syntaxHighlighter"
        style={{ ...style, position: "relative", overflow: "auto" }}
      >
        <pre>
          <TopRightSection
            code={code}
            copyToClipboard={copyToClipboard}
            language={language}
            displayLanguage={displayLanguage}
          />
          {code}
          {/* {withCursor ? <span className="terminalCursor">|</span> : null} */}
        </pre>
      </div>
    );
  }

  const {
    customBaseColors = {},
    cellTypeRebranding = {},
    customCellColors = {},
  } = customizeColors?.({
    tokens,
    baseColors,
  }) ?? {};

  const highlighted = colorizeTokens({
    code,
    tokens,
    baseColors: { ...baseColors, ...customBaseColors },
    cellTypeRebranding,
    customCellColors,
    addLineCounter,
  });

  return (
    <div className="syntaxHighlighter" style={{ ...style, position: "relative", overflow: "auto" }}>
      <pre>
        <TopRightSection
          code={code}
          copyToClipboard={copyToClipboard}
          language={language}
          displayLanguage={displayLanguage}
        />
        {highlighted.map((ele, index) => (
          <Fragment key={index}>{ele}</Fragment>
        ))}
        {/* {withCursor ? <span className="terminalCursor">|</span> : null} */}
      </pre>
    </div>
  );
};
