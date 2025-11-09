import { type CSSProperties, type JSX, Fragment, type RefObject } from "react";
import { TopRightSection } from "./TopRightSection";
import { displayColorlessCode } from "./utils";
import { type SupportedLanguages } from "./languages";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";
import { syntaxHighlighterClassName } from "./sharedClassNames";

type SimpleContentDesignProps = {
  className?: string;
  style?: CSSProperties;
  code: string;
  highlighted: JSX.Element[];
  language: SupportedLanguages;
  copyToClipboard?: boolean;
  displayLanguage?: boolean;
  addLineCounter: boolean;
  ref?: RefObject<HTMLPreElement | null>;
};

export const SimpleContentDesign = ({
  className,
  style,
  code,
  highlighted,
  copyToClipboard,
  language,
  displayLanguage,
  addLineCounter,
  ref,
}: SimpleContentDesignProps) => {
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
      <pre ref={ref}>
        <TopRightSection
          code={code}
          copyToClipboard={copyToClipboard}
          language={language}
          displayLanguage={displayLanguage}
        />
        {highlighted.length === 0
          ? displayColorlessCode({ code, addLineCounter })
          : highlighted.map((ele, index) => <Fragment key={index}>{ele}</Fragment>)}
        {/* {withCursor ? <span className={termainlCursorClassName}>|</span> : null} */}
      </pre>
    </div>
  );
};
