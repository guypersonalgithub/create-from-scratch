import * as vscode from "vscode";
import { trackDynaticFunctionsNames } from "../trackDynaticFunctionsNames";
import { getDynaticCSSTextToParse } from "../getDynaticCSSTextToParse";
import { TokenTypes } from "./tokenTypes";
import { parseCSS } from "@packages/parse-css";

const tokenTypes = [
  TokenTypes.PROPERTY,
  TokenTypes.STRING,
  TokenTypes.NUMBER,
  TokenTypes.COLOR,
  TokenTypes.FUNCTION,
  TokenTypes.KEYWORD, // for @-rules
  TokenTypes.PUNCTUATION,
];
const tokenModifiers: string[] = [];

export const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

export class CSSBaseSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
  async provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken,
  ): Promise<vscode.SemanticTokens> {
    const builder = new vscode.SemanticTokensBuilder(legend);
    const documentText = document.getText();
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

    sections.forEach((section) => {
      const { tokens } = parseCSS({
        input: remainingText.slice(section.start, section.end),
        extensionParsing: true,
        cssInJS: true,
      });

      const startOffset = fileStartOffset + section.start;

      tokens.forEach((token) => {
        const start = document.positionAt(token.startIndex + startOffset);

        const length = token.endIndex - token.startIndex;
        const line = start.line;
        const char = start.character;

        let tokenType: (typeof TokenTypes)[keyof typeof TokenTypes] | undefined;
        switch (token.type) {
          case "property":
            tokenType = TokenTypes.PROPERTY;
            break;
          case "string":
            tokenType = TokenTypes.STRING;
            break;
          case "color":
            tokenType = TokenTypes.COLOR;
            break;
          case "numeric":
            tokenType = TokenTypes.NUMBER;
            break;
          case "function":
            tokenType = TokenTypes.FUNCTION;
            break;
          case "at-keyword":
            tokenType = TokenTypes.KEYWORD;
            break;
          case "colon":
          case "end-of-line":
            tokenType = TokenTypes.PUNCTUATION;
            break;
        }

        if (tokenType) {
          builder.push(line, char, length, tokenTypes.indexOf(tokenType), 0);
        }
      });
    });

    return builder.build();
  }
}

// context.subscriptions.push(
//   vscode.languages.registerDocumentSemanticTokensProvider(
//     selector,
//     new CSSBaseSemanticTokensProvider(),
//     legend,
//   ),
// );

// =======================================================================================================

// const tokenTypes = ["property", "string", "number", "color"];
// const tokenModifiers = [];

// export const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

// class CSSBaseSemanticTokensProvidera implements vscode.DocumentSemanticTokensProvider {
//   async provideDocumentSemanticTokens(
//     document: vscode.TextDocument,
//     _token: vscode.CancellationToken,
//   ): Promise<vscode.SemanticTokens> {
//     const builder = new vscode.SemanticTokensBuilder(legend);
//     const text = document.getText();

//     // Example: match cssBase`...`
//     const regex = /cssBase`([\s\S]*?)`/g;
//     let match: RegExpExecArray | null;

//     while ((match = regex.exec(text))) {
//       const cssContent = match[1];
//       const start = document.positionAt(match.index + match[0].indexOf(cssContent));

//       // Example: highlight all "color:" occurrences
//       const colorRegex = /\bcolor\s*:/g;
//       let m: RegExpExecArray | null;
//       while ((m = colorRegex.exec(cssContent))) {
//         const pos = document.positionAt(match.index + match[0].indexOf(cssContent) + m.index);
//         builder.push(pos.line, pos.character, m[0].length, tokenTypes.indexOf("property"), 0);
//       }
//     }

//     return builder.build();
//   }
// }
