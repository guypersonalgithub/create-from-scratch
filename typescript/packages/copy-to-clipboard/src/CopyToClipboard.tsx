import { Button } from "@packages/button";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { Check, Copy } from "@packages/icons";

type CopyToClipboardProps = {
  textToCopy: string;
  delay?: number;
  withIcons?: boolean;
};

export const CopyToClipboard = ({ textToCopy, delay, withIcons }: CopyToClipboardProps) => {
  const { copied, copyToClipboard } = useCopyToClipboard({ textToCopy, delay });
  const copyContent = withIcons ? <Copy style={{ width: "24px", height: "24px" }} /> : "Copy";
  const copiedContent = withIcons ? <Check style={{ width: "28px", height: "24px" }} /> : "Copied";

  return (
    <Button
      onClick={() => copyToClipboard()}
      style={
        withIcons
          ? {
              background: "none",
              border: "none",
              width: "fit-content",
              height: "fit-content",
              cursor: "pointer",
            }
          : {}
      }
    >
      {!copied ? copyContent : copiedContent}
    </Button>
  );
};
