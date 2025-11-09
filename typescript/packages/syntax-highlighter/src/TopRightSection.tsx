import { CopyToClipboard } from "@packages/copy-to-clipboard";
import { type SupportedLanguages } from "./languages";
import { dynatic } from "@packages/dynatic-css";

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
    <div
      className={dynatic`
        position: absolute;
        right: 10px;
        display: flex;
        align-items: center;
      `}
    >
      {displayLanguage ? <div>{language}</div> : null}
      {copyToClipboard ? (
        <CopyToClipboard
          textToCopy={code}
          withIcons
          className={dynatic`
            color: white;
          `}
        />
      ) : null}
    </div>
  );
};
