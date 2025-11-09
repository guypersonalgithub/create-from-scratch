import { type CSSProperties, type JSX, Fragment, type RefObject } from "react";
import { displayColorlessCode } from "../utils";
import { CopyToClipboard } from "@packages/copy-to-clipboard";
import { type Variant } from "./types";
import { getDisplayableLanguage, getVariantClassNames } from "./utils";
import { type SupportedLanguages } from "../languages";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type ModernContentDesignProps = {
  className?: string;
  style?: CSSProperties;
  headerClassName?: string;
  headerStyle?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  code: string;
  highlighted: JSX.Element[];
  language: SupportedLanguages;
  copyToClipboard?: boolean;
  displayLanguage?: boolean;
  addLineCounter: boolean;
  variant?: Variant;
  ref?: RefObject<HTMLPreElement | null>;
};

export const ModernContentDesign = ({
  className,
  style,
  headerClassName,
  headerStyle,
  contentClassName,
  contentStyle,
  code,
  highlighted,
  language,
  copyToClipboard,
  displayLanguage = true,
  addLineCounter,
  variant = "dark",
  ref,
}: ModernContentDesignProps) => {
  const displayedLanguage = displayLanguage ? getDisplayableLanguage({ language }) : null;
  const variantClassNames = getVariantClassNames({ variant });

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          height: 100%;
          display: flex;
          flex-direction: column;
        `,
        className,
      )}
      style={style}
    >
      <div
        className={combineStringsWithSpaces(
          dynatic`
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
          `,
          variantClassNames.headerClassName,
          headerClassName,
        )}
        style={headerStyle}
      >
        <div
          className={dynatic`
            display: flex;
            align-items: center;
            gap: 0.5rem;
          `}
        >
          <span
            className={dynatic`
              color: white;
              font-size: 0.875rem;
              font-weight: 500;
            `}
          >
            {displayedLanguage}
          </span>
        </div>
        {copyToClipboard ? (
          <CopyToClipboard
            textToCopy={code}
            withIcons
            className={dynatic`
              color: white;
            `}
          />
        ) : null}
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            padding: 1rem;
            font-family: ui-monospace, SFMono-Regular, monospace;
            font-size: 0.875rem;
            flex: 1;
            overflow: auto;
          `,
          variantClassNames.contentClassName,
          contentClassName,
        )}
        style={
          contentStyle
          // minHeight: "140px",
        }
      >
        <pre ref={ref}>
          {highlighted.length === 0
            ? displayColorlessCode({ code, addLineCounter })
            : highlighted.map((ele, index) => <Fragment key={index}>{ele}</Fragment>)}
        </pre>
      </div>
    </div>
  );
};
