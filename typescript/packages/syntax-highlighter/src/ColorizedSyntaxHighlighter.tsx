import { supportedLanguages, SupportedLanguages } from "./languages";
import { StandardSyntaxHighlighterProps, HighlightedCode } from "./SyntaxHighlighter";
import { colorizeTokens } from "./colorizeTokens";
import { GenericBaseToken, GetHighlightedTokensArgs, TokenMaps } from "./types";
import { JSX, useEffect, useState } from "react";
import { WebWorkeredSyntaxHighlighter } from "./WebWorkeredSyntaxHighlighter";
import { SimpleContentDesign } from "./SimpleContentDesign";
import { ModernContentDesign } from "./ModernContentDesign";

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
  modernVersion = true,
  variant,
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

  if (modernVersion) {
    return (
      <ModernContentDesign
        style={style}
        code={code}
        highlighted={highlighted}
        language={language}
        copyToClipboard={copyToClipboard}
        displayLanguage={displayLanguage}
        addLineCounter={addLineCounter}
        variant={variant}
      />
    );
  }

  return (
    <SimpleContentDesign
      style={style}
      code={code}
      highlighted={highlighted}
      language={language}
      copyToClipboard={copyToClipboard}
      displayLanguage={displayLanguage}
      addLineCounter={addLineCounter}
    />
  );
};
