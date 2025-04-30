import { CopyToClipboard } from "@packages/copy-to-clipboard";
import { CSSProperties } from "react";

type CommandBoxProps = {
  command: string;
  style?: CSSProperties;
  copyToClipboard?: boolean;
  withIcons?: boolean;
};

export const CommandBox = ({ command, style, copyToClipboard, withIcons }: CommandBoxProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8fafc",
        // padding: "10px 16px",
        padding: "16px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        // width: "fit-content",
        // maxWidth: "100%",
        whiteSpace: "nowrap",
        // overflowX: "auto",
        ...style,
      }}
    >
      {command}
      {copyToClipboard ? <CopyToClipboard textToCopy={command} withIcons={withIcons} /> : null}
    </div>
  );
};
