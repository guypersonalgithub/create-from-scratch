import { combineStringsWithSpaces } from "@packages/string-utils";
import { InteractiveVisibilityTitle, InteractiveVisibilityTitleProps } from "@packages/title";
import { dynatic } from "../dynatic-css.config";

export const StyledInteractiveTitle = ({
  className,
  style,
  underlineClassName,
  underlineStyle,
  children,
}: InteractiveVisibilityTitleProps) => {
  return (
    <InteractiveVisibilityTitle
      className={combineStringsWithSpaces(
        dynatic`
            font-size: 24px;
            color: #ffffff;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-top: 8px;
            font-weight: 800;
            background: #0a0a0a;
            border-left: 6px solid #c40000;
            font-family: Inter, system-ui, -apple-system, sans-serif;
            padding-left: 10px;
        `,
        className,
      )}
      style={style}
      underlineClassName={combineStringsWithSpaces(
        dynatic`
            height: 2px;
            background: #ff1e1e;
            margin-top: 4px;
            margin-bottom: 12px;
        `,
        underlineClassName,
      )}
      underlineStyle={underlineStyle}
    >
      {children}
    </InteractiveVisibilityTitle>
  );
};
