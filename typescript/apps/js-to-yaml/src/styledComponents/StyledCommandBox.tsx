import { CommandBox } from "@packages/command-box";
import { type CSSProperties } from "react";

type StyledCommandBoxProps = {
  command: string;
  style?: CSSProperties;
  copyToClipboard?: boolean;
  withIcons?: boolean;
};

export const StyledCommandBox = ({
  command,
  style,
  copyToClipboard,
  withIcons,
}: StyledCommandBoxProps) => {
  return (
    <CommandBox
      command={command}
      style={{
        ...style,
        color: "var(--theme-color)",
        transition: "var(--theme-transition)",
        backgroundColor: "var(--theme-subBackground)",
        border: "1px solid var(--theme-border)",
      }}
      copyToClipboard={copyToClipboard}
      withIcons={withIcons}
    />
  );
};
