import * as vscode from "vscode";

export const selector: vscode.DocumentSelector = [
  { scheme: "file", language: "typescript" },
  { scheme: "file", language: "typescriptreact" },
];
