import { getDynaticCSSTextToParse } from "./getDynaticCSSTextToParse";
import { trackDynaticFunctionsNames } from "./trackDynaticFunctionsNames";
import { parseCSS } from "@packages/parse-css";
import type { CachedParsedFileSections } from "./types";

export const cachedParsedFiles = new Map<string, CachedParsedFileSections>();

type ParsingFlowArgs = {
  documentURI: string;
  documentText: string;
  skipIfAlreadyExists?: boolean;
};

export const parsingFlow = ({
  documentURI,
  documentText,
  skipIfAlreadyExists,
}: ParsingFlowArgs) => {
  if (skipIfAlreadyExists) {
    if (cachedParsedFiles.has(documentURI)) {
      return;
    }
  }

  const { relevantImports, currentIndex: fileStartOffset } = trackDynaticFunctionsNames({
    document: documentText,
  });

  if (relevantImports.length === 0) {
    return;
  }

  const remainingText = documentText.slice(fileStartOffset);
  const sections = getDynaticCSSTextToParse({
    text: remainingText,
    identifiers: relevantImports,
  });

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

  cachedParsedFiles.set(documentURI, parsedFile);
};
