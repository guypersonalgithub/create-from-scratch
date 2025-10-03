import * as vscode from "vscode";
import { cachedParsedFiles, parsingFlow } from "./parsingFlow";

const propertyDecoration = vscode.window.createTextEditorDecorationType({ color: "#9CDCFE" });
const valueDecoration = vscode.window.createTextEditorDecorationType({ color: "#CE9178" });
const whiteDecoration = vscode.window.createTextEditorDecorationType({ color: "white" });
const atDecoration = vscode.window.createTextEditorDecorationType({ color: "#C586C0" });
const numberDecoration = vscode.window.createTextEditorDecorationType({ color: "#B5CEA8" });
const functionDecoration = vscode.window.createTextEditorDecorationType({ color: "#DCDCAA" });
const nestingLevel1Decoration = vscode.window.createTextEditorDecorationType({ color: "#FFD700" });
const nestingLevel2Decoration = vscode.window.createTextEditorDecorationType({ color: "#DA70D6" });
const nestingLevel3Decoration = vscode.window.createTextEditorDecorationType({ color: "#179FFF" });

type HighlightTokensArgs = {
  documentURI: string;
  documentText: string;
};

export const highlightTokens = ({ documentURI, documentText }: HighlightTokensArgs) => {
  const activeEditor = vscode.window.activeTextEditor;

  if (!activeEditor) {
    return;
  }

  let parsedFile = cachedParsedFiles.get(documentURI);
  if (!parsedFile) {
    parsingFlow({ documentURI, documentText });
    parsedFile = cachedParsedFiles.get(documentURI);
  }
  
  if (!parsedFile) {
    return;
  }

  const propertyRanges: vscode.DecorationOptions[] = [];
  const valueRanges: vscode.DecorationOptions[] = [];
  const whiteRanges: vscode.DecorationOptions[] = [];
  const atRanges: vscode.DecorationOptions[] = [];
  const numberRanges: vscode.DecorationOptions[] = [];
  const functionRanges: vscode.DecorationOptions[] = [];
  const nestingLevel1Ranges: vscode.DecorationOptions[] = [];
  const nestingLevel2Ranges: vscode.DecorationOptions[] = [];
  const nestingLevel3Ranges: vscode.DecorationOptions[] = [];
  const doc = activeEditor.document;

  let curlyBrackets = 0;
  let parenthesis = 0;

  parsedFile.forEach(({ tokens }) => {
    tokens.forEach((token) => {
      const { startIndex, endIndex } = token;

      if (token.type === "property") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);
        propertyRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "string" || token.type === "color") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);
        valueRanges.push({ range: new vscode.Range(start, end) });
      } else if (
        token.type === "colon" ||
        token.type === "comma" ||
        token.type === "end-of-line" ||
        token.type === "at-word" ||
        token.type === "at-operator"
      ) {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);
        whiteRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "at-keyword") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);
        atRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "numeric") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);
        numberRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "function") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);
        functionRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "open-curly-bracket") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);

        curlyBrackets++;

        const nestingLevel = curlyBrackets + parenthesis;
        let decorationOptions: vscode.DecorationOptions[];
        if (nestingLevel % 3 === 1) {
          decorationOptions = nestingLevel1Ranges;
        } else if (nestingLevel % 3 === 2) {
          decorationOptions = nestingLevel2Ranges;
        } else {
          decorationOptions = nestingLevel3Ranges;
        }

        decorationOptions.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "close-curly-bracket") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);

        const nestingLevel = curlyBrackets + parenthesis;
        let decorationOptions: vscode.DecorationOptions[];
        if (nestingLevel % 3 === 1) {
          decorationOptions = nestingLevel1Ranges;
        } else if (nestingLevel % 3 === 2) {
          decorationOptions = nestingLevel2Ranges;
        } else {
          decorationOptions = nestingLevel3Ranges;
        }

        decorationOptions.push({ range: new vscode.Range(start, end) });

        curlyBrackets--;
      } else if (token.type === "open-parenthesis" || token.type === "at-open-parenthesis") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);

        parenthesis++;

        const nestingLevel = curlyBrackets + parenthesis;
        let decorationOptions: vscode.DecorationOptions[];
        if (nestingLevel % 3 === 1) {
          decorationOptions = nestingLevel1Ranges;
        } else if (nestingLevel % 3 === 2) {
          decorationOptions = nestingLevel2Ranges;
        } else {
          decorationOptions = nestingLevel3Ranges;
        }

        decorationOptions.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "close-parenthesis" || token.type === "at-close-parenthesis") {
        const start = doc.positionAt(startIndex);
        const end = doc.positionAt(endIndex);

        const nestingLevel = curlyBrackets + parenthesis;
        let decorationOptions: vscode.DecorationOptions[];
        if (nestingLevel % 3 === 1) {
          decorationOptions = nestingLevel1Ranges;
        } else if (nestingLevel % 3 === 2) {
          decorationOptions = nestingLevel2Ranges;
        } else {
          decorationOptions = nestingLevel3Ranges;
        }

        decorationOptions.push({ range: new vscode.Range(start, end) });

        parenthesis--;
      }
    });
  });

  activeEditor.setDecorations(propertyDecoration, propertyRanges);
  activeEditor.setDecorations(valueDecoration, valueRanges);
  activeEditor.setDecorations(whiteDecoration, whiteRanges);
  activeEditor.setDecorations(atDecoration, atRanges);
  activeEditor.setDecorations(numberDecoration, numberRanges);
  activeEditor.setDecorations(functionDecoration, functionRanges);
  activeEditor.setDecorations(nestingLevel1Decoration, nestingLevel1Ranges);
  activeEditor.setDecorations(nestingLevel2Decoration, nestingLevel2Ranges);
  activeEditor.setDecorations(nestingLevel3Decoration, nestingLevel3Ranges);
};
