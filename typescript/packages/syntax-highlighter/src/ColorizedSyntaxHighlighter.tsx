import { supportedLanguages, SupportedLanguages } from "./languages";
import { StandardSyntaxHighlighterProps, HighlightedCode } from "./SyntaxHighlighter";
import { colorizeTokens } from "./colorizeTokens";
import { GenericBaseToken, GetHighlightedTokensArgs, TokenMaps } from "./types";
import { Fragment, JSX, useEffect, useState } from "react";
import { TopRightSection } from "./TopRightSection";
import { WebWorkeredSyntaxHighlighter } from "./WebWorkeredSyntaxHighlighter";
import { countLines } from "@packages/utils";
import { getCurrentLineCounterElement } from "./utils";

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
  StandardSyntaxHighlighterProps & Omit<HighlightedCode<T>, "highlightCode">;

export const ColorizedSyntaxHighlighter = <T extends SupportedLanguages = "typescript">({
  withWebWorker,
  ...rest
}: ColorizedSyntaxHighlighterProps<T>) => {
  if (withWebWorker) {
    return <WebWorkeredSyntaxHighlighter {...rest} />;
  }

  return <StandardSyntaxHighlighter {...rest} />;
};

const StandardSyntaxHighlighter = <T extends SupportedLanguages = "typescript">({
  code,
  style,
  language = "typescript",
  copyToClipboard = true,
  customizeColors,
  addLineCounter = true,
  displayLanguage,
}: Omit<ColorizedSyntaxHighlighterProps<T>, "withWebWorker">) => {
  const [highlighted, setHighlighted] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHighlighted(
        getHighlightedTokens<T>({
          code,
          language,
          customizeColors,
          addLineCounter,
        }),
      );
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [code, language]);

  return (
    <div className="syntaxHighlighter" style={{ ...style, position: "relative", overflow: "auto" }}>
      <pre>
        <TopRightSection
          code={code}
          copyToClipboard={copyToClipboard}
          language={language}
          displayLanguage={displayLanguage}
        />
        {highlighted.length === 0
          ? displayColorlessCode({ code, addLineCounter })
          : highlighted.map((ele, index) => <Fragment key={index}>{ele}</Fragment>)}
        {/* {withCursor ? <span className="terminalCursor">|</span> : null} */}
      </pre>
    </div>
  );
};

type DisplayColorlessCodeArgs = {
  code: string;
  addLineCounter: boolean;
};

const displayColorlessCode = ({ code, addLineCounter }: DisplayColorlessCodeArgs) => {
  if (!addLineCounter) {
    return code;
  }

  const { linesCount, splitStr = [] } = countLines({ str: code, returnSplitStr: true });
  const maximumLinesLength = linesCount.toString().length;
  const splitStrLength = splitStr.length;

  return splitStr.map((line, index) => {
    const prefix = getCurrentLineCounterElement({ lineCounter: index + 1, maximumLinesLength });
    const addLinebreak = index !== splitStrLength - 1;

    return `${prefix}${line}${addLinebreak ? "\n" : ""}`;
  });
};
