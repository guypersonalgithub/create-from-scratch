import { getDynaticCSSTextToParse } from "./getDynaticCSSTextToParse";
import { trackDynaticFunctionsNames } from "./trackDynaticFunctionsNames";
import type { CachedParsedFileSections } from "./types";
import { createParsedFile } from "./createParsedFile";

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

  const parsedFile = createParsedFile({ remainingText, fileStartOffset, sections });
  cachedParsedFiles.set(documentURI, parsedFile);
};
