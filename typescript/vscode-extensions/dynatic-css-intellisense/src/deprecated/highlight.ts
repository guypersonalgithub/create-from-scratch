import * as vscode from "vscode";
import { parseCSS } from "@packages/parse-css";

const regex = /cssBase`([\s\S]*?)`/g;

let activeEditor: vscode.TextEditor | undefined;
let timeout: ReturnType<typeof setTimeout>;

// Decoration types
const propertyDecoration = vscode.window.createTextEditorDecorationType({ color: "#9CDCFE" });
const valueDecoration = vscode.window.createTextEditorDecorationType({ color: "#CE9178" });
const whiteDecoration = vscode.window.createTextEditorDecorationType({ color: "white" });
const atDecoration = vscode.window.createTextEditorDecorationType({ color: "#C586C0" });
const numberDecoration = vscode.window.createTextEditorDecorationType({ color: "#B5CEA8" });
const functionDecoration = vscode.window.createTextEditorDecorationType({ color: "#DCDCAA" });

export const activateHighlighter = () => {
  activeEditor = vscode.window.activeTextEditor;

  if (activeEditor) {
    triggerUpdateDecorations();
  }

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    activeEditor = editor;
    if (editor) updateDecorations();
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    if (activeEditor && event.document === activeEditor.document) {
      triggerUpdateDecorations();
    }
  });
};

const triggerUpdateDecorations = () => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(updateDecorations, 100);
};

const updateDecorations = () => {
  if (!activeEditor) return;

  const text = activeEditor.document.getText();
  const propertyRanges: vscode.DecorationOptions[] = [];
  const valueRanges: vscode.DecorationOptions[] = [];
  const whiteRanges: vscode.DecorationOptions[] = [];
  const atRanges: vscode.DecorationOptions[] = [];
  const numberRanges: vscode.DecorationOptions[] = [];
  const functionRanges: vscode.DecorationOptions[] = [];

  // Track line/character positions
  const doc = activeEditor.document;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    const value = match[1];
    const { tokens } = parseCSS({ input: value, extensionParsing: true, cssInJS: true });
    const startOffset = match.index + match[0].indexOf(match[1]);

    tokens.forEach((token) => {
      if (token.type === "property") {
        const start = doc.positionAt(token.startIndex + startOffset);
        const end = doc.positionAt(token.endIndex + startOffset);
        propertyRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "string" || token.type === "color") {
        const start = doc.positionAt(token.startIndex + startOffset);
        const end = doc.positionAt(token.endIndex + startOffset);
        valueRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "colon" || token.type === "end-of-line") {
        const start = doc.positionAt(token.startIndex + startOffset);
        const end = doc.positionAt(token.endIndex + startOffset);
        whiteRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "at-keyword") {
        const start = doc.positionAt(token.startIndex + startOffset);
        const end = doc.positionAt(token.endIndex + startOffset);
        atRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "numeric") {
        const start = doc.positionAt(token.startIndex + startOffset);
        const end = doc.positionAt(token.endIndex + startOffset);
        numberRanges.push({ range: new vscode.Range(start, end) });
      } else if (token.type === "function") {
        const start = doc.positionAt(token.startIndex + startOffset);
        const end = doc.positionAt(token.endIndex + startOffset);
        functionRanges.push({ range: new vscode.Range(start, end) });
      }
    });
  }

  // Apply decorations
  activeEditor.setDecorations(propertyDecoration, propertyRanges);
  activeEditor.setDecorations(valueDecoration, valueRanges);
  activeEditor.setDecorations(whiteDecoration, whiteRanges);
  activeEditor.setDecorations(atDecoration, atRanges);
  activeEditor.setDecorations(numberDecoration, numberRanges);
  activeEditor.setDecorations(functionDecoration, functionRanges);
};

// context.subscriptions.push(
//   vscode.commands.registerCommand("cssbase.activateHighlighter", () => {
//     activateHighlighter();
//   }),
// );
