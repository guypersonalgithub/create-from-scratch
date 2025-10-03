import * as vscode from "vscode";
import { cachedParsedFiles, parsingFlow } from "../parsingFlow";
import type { Section } from "../types";

export let cachedSection = new Map<string, Section>();

type FindCurrentSectionArgs = {
  document: vscode.TextDocument;
  position: vscode.Position;
};

export const findCurrentSection = ({ document, position }: FindCurrentSectionArgs) => {
  const documentURI = document.uri.toString();
  const documentText = document.getText();

  let parsedFile = cachedParsedFiles.get(documentURI);
  if (!parsedFile) {
    parsingFlow({ documentURI, documentText });
    parsedFile = cachedParsedFiles.get(documentURI);
  }

  if (!parsedFile) {
    return;
  }

  const offset = document.offsetAt(position);

  const currentSection = parsedFile.find(
    (section) => section.startOffset <= offset && offset <= section.endOffset,
  );

  // cachedSection = new Map<string, Section>();
  if (currentSection) {
    cachedSection.set(documentURI, currentSection);
  }

  return currentSection;
};
