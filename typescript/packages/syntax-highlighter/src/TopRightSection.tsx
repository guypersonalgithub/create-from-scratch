import { CopyToClipboard } from "@packages/copy-to-clipboard";
import { type SupportedLanguages } from "./languages";

type TopRightSectionProps = {
  code: string;
  copyToClipboard?: boolean;
  language?: SupportedLanguages;
  displayLanguage?: boolean;
};

export const TopRightSection = ({
  code,
  copyToClipboard,
  language,
  displayLanguage,
}: TopRightSectionProps) => {
  if (!copyToClipboard && !displayLanguage) {
    return null;
  }

  return (
    <div style={{ position: "absolute", right: "10px", display: "flex", alignItems: "center" }}>
      {displayLanguage ? <div>{language}</div> : null}
      {copyToClipboard ? (
        <CopyToClipboard textToCopy={code} withIcons style={{ color: "white" }} />
      ) : null}
    </div>
  );
};
