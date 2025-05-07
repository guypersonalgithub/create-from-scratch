import { supportedLanguages, SupportedLanguages } from "./languages";
import { StandardSyntaxHighlighterProps, HighlightedCode } from "./SyntaxHighlighter";
import { colorizeTokens } from "./colorizeTokens";
import { GenericBaseToken, TokenMaps } from "./types";
import { Fragment, useEffect, useRef, useState } from "react";
import { TopRightSection } from "./TopRightSection";
import HighlightWorker from "./webWorker?worker";

type GetHighlightedTokensArgs<T extends SupportedLanguages = "typescript"> = {
  code: string;
  language?: SupportedLanguages;
  customizeColors?: (args: {
    tokens: GenericBaseToken<T>[];
    baseColors: Record<TokenMaps[T], string>;
  }) =>
    | {
        customBaseColors?: Partial<Record<TokenMaps[T], string>>;
        cellTypeRebranding?: Record<number, TokenMaps[T]>;
        customCellColors?: Record<number, string>;
      }
    | never;
  addLineCounter?: boolean | never;
};

const getHighlightedTokens = <T extends SupportedLanguages = "typescript">({
  code,
  language = "typescript",
  customizeColors,
  addLineCounter,
}: GetHighlightedTokensArgs<T>) => {
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
    code,
    tokens,
    baseColors: { ...baseColors, ...customBaseColors },
    cellTypeRebranding,
    customCellColors,
    addLineCounter,
  });

  return highlighted;
};

type ColorizedSyntaxHighlighterProps<T extends SupportedLanguages = "typescript"> =
  StandardSyntaxHighlighterProps & HighlightedCode<T>;

export const ColorizedSyntaxHighlighter = <T extends SupportedLanguages = "typescript">({
  withWebWorker,
  ...rest
}: ColorizedSyntaxHighlighterProps<T>) => {
  if (withWebWorker) {
    return <WebWorkeredSyntaxHighlighter {...rest} />;
  }

  const {
    code,
    language,
    customizeColors,
    addLineCounter,
    style,
    copyToClipboard,
    displayLanguage,
  } = rest;

  const highlighted = getHighlightedTokens<T>({
    code,
    language,
    customizeColors,
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

const WebWorkeredSyntaxHighlighter = <T extends SupportedLanguages = "typescript">({
  code,
  highlightCode,
  style,
  language = "typescript",
  copyToClipboard = true,
  customizeColors,
  addLineCounter = true,
  displayLanguage,
}: Omit<ColorizedSyntaxHighlighterProps<T>, "withWebWorker">) => {
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
