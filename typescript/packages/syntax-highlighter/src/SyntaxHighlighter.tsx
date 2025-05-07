import { CSSProperties } from "react";
import "./styles.css";
import { Animated, GenericBaseToken, TokenMaps } from "./types";
import { SupportedLanguages } from "./languages";
import { AnimatedCode } from "./AnimatedCode";
import { ColorizedSyntaxHighlighter } from "./ColorizedSyntaxHighlighter";

export type StandardSyntaxHighlighterProps = {
  code: string;
  style?: CSSProperties;
  language?: SupportedLanguages;
  displayLanguage?: boolean;
  copyToClipboard?: boolean;
};

export type SyntaxHighlighterProps<T extends SupportedLanguages = "typescript"> =
  StandardSyntaxHighlighterProps & (HighlightedCode<T> | UnhighlightedCode) & Animated;

export type HighlightedCode<T extends SupportedLanguages = "typescript"> = {
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
  withWebWorker?: boolean;
};

type UnhighlightedCode = {
  highlightCode?: never;
  customizeColors?: never;
  addLineCounter?: never;
  withWebWorker?: never;
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
  withWebWorker,
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
    return (
      <ColorizedSyntaxHighlighter
        code={code}
        language={language}
        style={style}
        copyToClipboard={copyToClipboard}
        customizeColors={customizeColors}
        addLineCounter={addLineCounter}
        displayLanguage={displayLanguage}
        withWebWorker={withWebWorker}
      />
    );
  }

  return (
    <pre className="syntaxHighlighter" style={style}>
      {code}
      {withCursor ? <span className="terminalCursor">|</span> : null}
    </pre>
  );
};
