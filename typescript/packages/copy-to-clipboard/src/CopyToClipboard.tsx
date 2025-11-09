import { Button } from "@packages/button";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { Copy, SimpleCheck } from "@packages/icons";
import { type CSSProperties } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type CopyToClipboardProps = {
  className?: string;
  style?: CSSProperties;
  textToCopy: string;
  delay?: number;
  withIcons?: boolean;
};

export const CopyToClipboard = ({
  className,
  style,
  textToCopy,
  delay,
  withIcons,
}: CopyToClipboardProps) => {
  const { copied, copyToClipboard } = useCopyToClipboard({ textToCopy, delay });
  const copyContent = withIcons ? (
    // <ClipboardDocument className={dynatic`
    //    width: 24px;
    //    height: 24px;
    //  `} />
    <Copy
      className={dynatic`
        width: 16px;
        height: 16px;
      `}
    />
  ) : (
    "Copy"
  );
  const copiedContent = withIcons ? (
    // <ClipboardDocumentCheck className={dynatic`
    //    width: 24px;
    //    height: 24px;
    //  `} />
    <SimpleCheck
      className={dynatic`
        width: 16px;
        height: 16px;
      `}
    />
  ) : (
    "Copied"
  );

  return (
    <Button
      onClick={() => copyToClipboard()}
      className={combineStringsWithSpaces(
        className,
        withIcons &&
          dynatic`
            background: none;
            border: none;
            width: fit-content;
            height: fit-content;
            cursor: pointer;
          `,
      )}
      style={style}
    >
      {!copied ? copyContent : copiedContent}
    </Button>
  );
};
