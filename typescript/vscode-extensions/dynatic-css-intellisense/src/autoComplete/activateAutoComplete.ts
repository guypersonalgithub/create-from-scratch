import * as vscode from "vscode";
import { selector } from "../selector";
import { cssValues } from "./cssValues";
import { currentTokens } from "./findSurroundingTokens";
import { cachedSection } from "./findCurrentSection";
import { cssProperties } from "./cssProperties";
import { fuzzyMatch } from "@packages/string-utils";

// interface MyCompletionItem extends vscode.CompletionItem {
//   data?: any;
// }

export const activateAutoComplete = () => {
  const provider = vscode.languages.registerCompletionItemProvider(
    selector,
    {
      provideCompletionItems(document, position) {
        const documentURI = document.uri.toString();

        const currentSection = cachedSection.get(documentURI);
        if (!currentSection) {
          return;
        }

        // const documentText = document.getText();
        // const offset = document.offsetAt(position);

        let values: readonly string[] | string[] = [];

        const currentToken = currentTokens.get("currentToken");
        const propertyToken = currentTokens.get("propertyToken");
        const previousToken = currentTokens.get("previousToken");
        let prefix = "",
          addition = "",
          suffix = "";

        if (!propertyToken) {
          values = cssProperties;

          if (previousToken?.type !== "at-open-parenthesis") {
            addition = ": ";
            suffix = ";";
          }
        } else {
          values = cssValues[propertyToken.value as keyof typeof cssValues] ?? [];
        }

        if (currentToken && currentToken.type !== "colon") {
          const option = values.find((option) =>
            fuzzyMatch({ str: option, input: currentToken.value }),
          );

          if (!option) {
            vscode.commands.executeCommand("dynaticCSS.dismissSuggest");

            return;
          }
        }

        // const previousToken = currentTokens.get("previousToken");
        // const nextToken = currentTokens.get("nextToken");
        // const autoCompleteProperty =
        //   !previousToken ||
        //   previousToken.value === ";" ||
        //   previousToken.value === "{" ||
        //   previousToken.value === "}";

        // if (autoCompleteProperty) {
        //   values = cssProperties;
        // } else {
        //   const currentToken = currentTokens.get("currentToken");

        //   values = cssValues[currentToken.value];
        //   if (!values) {
        //     return;
        //   }
        // }

        // const currentChar = documentText[offset - 1];
        // const prefix = !autoCompleteProperty ? (currentChar === " " ? "" : " ") : "";
        // const suffix = nextToken?.value === ";" ? "" : ";";

        const items = values.map((value: string) => {
          const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value);
          // Adding $0 alters the cursor position.
          item.insertText = new vscode.SnippetString(`${prefix}${value}${addition}$0${suffix}`);
          item.sortText = "000"; // prioritize
          return item;
        });

        return new vscode.CompletionList(items, true);
      },
      // resolveCompletionItem(item, token) {
      //   console.log("??", item, token);
      //   return item;
      // },
    },
    // ":",
    // " ",
    // "a",
    // "b",
    // "c",
    // "d",
    // "e",
    // "f",
    // "g",
    // "h",
    // "i",
    // "j",
    // "k",
    // "l",
    // "m",
    // "n",
    // "o",
    // "p",
    // "q",
    // "r",
    // "s",
    // "t",
    // "u",
    // "v",
    // "w",
    // "x",
    // "y",
    // "z",
    // "0",
    // "1",
    // "2",
    // "3",
    // "4",
    // "5",
    // "6",
    // "7",
    // "8",
    // "9", // trigger chars
  );

  return provider;
};
