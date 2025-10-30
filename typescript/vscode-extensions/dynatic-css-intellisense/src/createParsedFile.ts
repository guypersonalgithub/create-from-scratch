import { parseCSS } from "@packages/parse-css";
import type { BaseSection } from "./types";

type CreateParsedFileArgs = {
  remainingText: string;
  fileStartOffset: number;
  sections: BaseSection[];
};

export const createParsedFile = ({
  remainingText,
  fileStartOffset,
  sections,
}: CreateParsedFileArgs) => {
  const parsedFile = sections.map((section) => {
    const { tokens } = parseCSS({
      input: remainingText.slice(section.start, section.end),
      extensionParsing: true,
      cssInJS: true,
    });
    const startOffset = fileStartOffset + section.start;
    const endOffset = fileStartOffset + section.end;

    return {
      tokens: tokens.map((token) => {
        const { type, value, startIndex, endIndex } = token;

        return {
          type,
          value,
          startIndex: startIndex + startOffset,
          endIndex: endIndex + startOffset,
        };
      }),
      startOffset,
      endOffset,
    };
  });

  return parsedFile;
};
