import { Button } from "@packages/button";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { Copy, SimpleCheck } from "@packages/icons";
import { CSSProperties } from "react";

type CopyToClipboardProps = {
  style?: CSSProperties;
  textToCopy: string;
  delay?: number;
  withIcons?: boolean;
};

export const CopyToClipboard = ({ style, textToCopy, delay, withIcons }: CopyToClipboardProps) => {
  const { copied, copyToClipboard } = useCopyToClipboard({ textToCopy, delay });
  const copyContent = withIcons ? (
    // <ClipboardDocument style={{ width: "24px", height: "24px" }} />
    <Copy style={{ width: "16px", height: "16px" }} />
  ) : (
    "Copy"
  );
  const copiedContent = withIcons ? (
    // <ClipboardDocumentCheck style={{ width: "24px", height: "24px" }} />
    <SimpleCheck style={{ width: "16px", height: "16px" }} />
  ) : (
    "Copied"
  );

  return (
    <Button
      onClick={() => copyToClipboard()}
      style={{
        ...(withIcons
          ? {
              background: "none",
              border: "none",
              width: "fit-content",
              height: "fit-content",
              cursor: "pointer",
            }
          : {}),
        ...style,
      }}
    >
      {!copied ? copyContent : copiedContent}
    </Button>
  );
};
