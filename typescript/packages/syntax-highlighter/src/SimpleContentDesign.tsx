import { type CSSProperties, type JSX, Fragment, type RefObject } from "react";
import { TopRightSection } from "./TopRightSection";
import { displayColorlessCode } from "./utils";
import { type SupportedLanguages } from "./languages";

type SimpleContentDesignProps = {
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
    <div className="syntaxHighlighter" style={{ ...style, position: "relative", overflow: "auto" }}>
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
        {/* {withCursor ? <span className="terminalCursor">|</span> : null} */}
      </pre>
    </div>
  );
};
