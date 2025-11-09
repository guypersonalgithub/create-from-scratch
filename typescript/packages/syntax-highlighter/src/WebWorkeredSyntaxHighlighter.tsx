import { type SupportedLanguages } from "./languages";
import { type StandardSyntaxHighlighterProps, type HighlightedCode } from "./SyntaxHighlighter";
import { colorizeTokens } from "./colorizeTokens";
import { type GenericBaseToken, type TokenMaps } from "./types";
import { Fragment, useEffect, useRef, useState } from "react";
import { TopRightSection } from "./TopRightSection";
/* Normally - const worker = new Worker(new URL('./webWorker.ts', import.meta.url), { type: 'module' });
?worker isn't standard Javascript, its a bundler feature for Vite to treat it as a Web Worker and return a Worker constructor, that means 
const worker = new MyWorker() - worker is a real Worker instance running the code from ./webWorker.ts in its own thread — no manual new Worker(new URL(...)) needed */
import HighlightWorker from "./webWorker?worker";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";
import { syntaxHighlighterClassName } from "./sharedClassNames";

type WebWorkeredSyntaxHighlighterProps<T extends SupportedLanguages = "typescript"> =
  StandardSyntaxHighlighterProps & Omit<HighlightedCode<T>, "highlightCode" | "withWebWorker">;

export const WebWorkeredSyntaxHighlighter = <T extends SupportedLanguages = "typescript">({
  code,
  className,
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
        className={combineStringsWithSpaces(
          dynatic`
            position: relative;
            overflow: auto;
          `,
          syntaxHighlighterClassName,
          className,
        )}
        style={style}
      >
        <pre>
          <TopRightSection
            code={code}
            copyToClipboard={copyToClipboard}
            language={language}
            displayLanguage={displayLanguage}
          />
          {code}
          {/* {withCursor ? <span className={termainlCursorClassName}>|</span> : null} */}
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
    <div
      className={combineStringsWithSpaces(
        dynatic`
          position: relative;
          overflow: auto;
        `,
        syntaxHighlighterClassName,
        className,
      )}
      style={style}
    >
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
        {/* {withCursor ? <span className={termainlCursorClassName}>|</span> : null} */}
      </pre>
    </div>
  );
};
