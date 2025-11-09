import { CommandBox } from "@packages/command-box";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type CSSProperties } from "react";
import { dynatic } from "../dynatic-css.config";

type StyledCommandBoxProps = {
  command: string;
  className?: string;
  style?: CSSProperties;
  copyToClipboard?: boolean;
  withIcons?: boolean;
};

export const StyledCommandBox = ({
  command,
  className,
  style,
  copyToClipboard,
  withIcons,
}: StyledCommandBoxProps) => {
  return (
    <CommandBox
      command={command}
      className={combineStringsWithSpaces(
        dynatic`
          color: ${(config) => config.colors.mainColor};
          transition: ${(config) => config.shared.defaultTransition};
          background-color: ${(config) => config.colors.secondaryBG};
          border: ${(config) => config.colors.defaultBorder};
        `,
        className,
      )}
      style={style}
      copyToClipboard={copyToClipboard}
      withIcons={withIcons}
    />
  );
};
