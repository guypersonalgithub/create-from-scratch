import { Button } from "@packages/button";
import { useCopyToClipboard } from "./useCopyToClipboard";

type CopyToClipboardProps = {
  textToCopy: string;
  delay?: number;
};

export const CopyToClipboard = ({ textToCopy, delay }: CopyToClipboardProps) => {
  const { copied, copyToClipboard } = useCopyToClipboard({ textToCopy, delay });

  return <Button onClick={() => copyToClipboard()}>{!copied ? "Copy" : "Copied"}</Button>;
};
