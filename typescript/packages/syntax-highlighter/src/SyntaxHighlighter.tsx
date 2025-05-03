import { CSSProperties, Fragment } from "react";
import "./styles.css";
import { colorizeTokens } from "./colorizeTokens";
import { Animated, GenericBaseToken, TokenMaps } from "./types";
import { supportedLanguages, SupportedLanguages } from "./languages";
import { AnimatedCode } from "./AnimatedCode";
import { TopRightSection } from "./TopRightSection";

export type SyntaxHighlighterProps<T extends SupportedLanguages = "typescript"> = {
  code: string;
  style?: CSSProperties;
  language?: SupportedLanguages;
  displayLanguage?: boolean;
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
      addLineCounter?: boolean;
    }
  | {
      highlightCode?: never;
      customizeColors?: never;
      addLineCounter?: never;
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
  addLineCounter = true,
  displayLanguage,
}: SyntaxHighlighterProps<T>) => {
  if (animatedWriting) {
    return (
      <AnimatedCode
        code={code}
        withCursor={withCursor}
        pacing={pacing}
        style={style}
        copyToClipboard={copyToClipboard}
        language={language}
        displayLanguage={displayLanguage}
      />
    );
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
      code,
      tokens,
      baseColors: { ...baseColors, ...customBaseColors },
      cellTypeRebranding,
      customCellColors,
      addLineCounter,
    });

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
