import * as vscode from "vscode";
import { findCurrentSection } from "./findCurrentSection";
import type { BaseToken } from "@packages/parse-css";
import { getCurrentOffsetTokens } from "./getCurrentOffsetTokens";

export let currentTokens = new Map<string, BaseToken>();

type FindSurroundingTokensArgs = {
  document: vscode.TextDocument;
  position: vscode.Position;
  value: string;
};

export const findSurroundingTokens = ({ document, position, value }: FindSurroundingTokensArgs) => {
  currentTokens = new Map();
  const currentSection = findCurrentSection({ document, position });
  if (!currentSection) {
    return;
  }

  const offset = document.offsetAt(position);
  const { tokens } = currentSection;

  const parsed = getCurrentOffsetTokens({ offset, tokens, value });

  if (!parsed) {
    return;
  }

  const { currentToken, previousToken, propertyToken } = parsed;
  currentTokens.set("currentToken", currentToken);

  if (propertyToken) {
    currentTokens.set("propertyToken", propertyToken);
  }

  if (previousToken) {
    currentTokens.set("previousToken", previousToken);
  }

  return parsed;
};
