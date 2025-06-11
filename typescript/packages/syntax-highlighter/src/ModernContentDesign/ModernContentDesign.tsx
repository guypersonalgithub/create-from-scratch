import { CSSProperties, JSX, Fragment, RefObject } from "react";
import { displayColorlessCode } from "../utils";
import { CopyToClipboard } from "@packages/copy-to-clipboard";
import { Variant } from "./types";
import { getDisplayableLanguage, getVariantColors } from "./utils";
import { SupportedLanguages } from "../languages";

type ModernContentDesignProps = {
  style?: CSSProperties;
  headerStyle?: CSSProperties;
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
  style,
  headerStyle,
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
  const { headerBackgroundColor, headerColor, border, contentBackgroundColor, contentColor } =
    getVariantColors({ variant });

  return (
    <div
      style={{
        ...style,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
          backgroundColor: headerBackgroundColor,
          borderBottom: `1px solid ${border}`,
          ...headerStyle,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: headerColor,
            }}
          >
            {displayedLanguage}
          </span>
        </div>
        {copyToClipboard ? (
          <CopyToClipboard textToCopy={code} withIcons style={{ color: headerColor }} />
        ) : null}
      </div>
      <div
        style={{
          padding: "1rem",
          backgroundColor: contentBackgroundColor,
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: "0.875rem",
          color: contentColor,
          flex: 1,
          overflow: "auto",
          // minHeight: "140px",
          ...contentStyle,
        }}
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
