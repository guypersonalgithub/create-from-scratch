import { CopyToClipboard } from "@packages/copy-to-clipboard";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type CSSProperties } from "react";

type CommandBoxProps = {
  command: string;
  className?: string;
  style?: CSSProperties;
  copyToClipboard?: boolean;
  withIcons?: boolean;
};

export const CommandBox = ({
  command,
  className,
  style,
  copyToClipboard,
  withIcons,
}: CommandBoxProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f8fafc;
          padding: 10px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 14px;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          white-space: nowrap;
        `,
        className,
      )}
      style={
        style
        // padding: "10px 16px",
        // width: "fit-content",
        // maxWidth: "100%",
        // overflowX: "auto",
      }
    >
      {command}
      {copyToClipboard ? <CopyToClipboard textToCopy={command} withIcons={withIcons} /> : null}
    </div>
  );
};
