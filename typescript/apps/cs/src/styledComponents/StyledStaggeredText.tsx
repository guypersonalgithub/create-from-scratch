import { StaggeredText } from "@packages/staggered";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../dynatic-css.config";

type StyledStaggeredTextProps = {
  children: string;
};

export const StyledStaggeredText = ({ children }: StyledStaggeredTextProps) => {
  return (
    <StaggeredText
      className={combineStringsWithSpaces(
        dynatic`
        ${(config) => config.utils.descendantSelector({ classNames: ["parent:hover", "char--transform: translateY(0);"] })} {
            transform: translateY(-30px);
        }
        `,
        "parent",
      )}
      charClassName={combineStringsWithSpaces(
        dynatic`
            transform: translateY(0);
        `,
        "char",
      )}
    >
      {children}
    </StaggeredText>
  );
};
