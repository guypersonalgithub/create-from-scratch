import * as vscode from "vscode";
import { activateColorProvider } from "./colorProvider";
import { parsingFlow } from "./parsingFlow";
import { highlightTokens } from "./highlightTokens";
import { activateAutoComplete } from "./autoComplete/activateAutoComplete";
import { findSurroundingTokens } from "./autoComplete/findSurroundingTokens";
import { fuzzyMatch, isAlphaNumeric } from "@packages/utils";
import { cssProperties } from "./autoComplete/cssProperties";
import { cssValues } from "./autoComplete/cssValues";

export function activate(context: vscode.ExtensionContext) {
  // let isSuggestOpen = false;

  // Track function names for the currently active editor (if any)
  if (vscode.window.activeTextEditor) {
    const { document } = vscode.window.activeTextEditor;
    const documentURI = document.uri.toString();
    const documentText = document.getText();

    parsingFlow({ documentURI, documentText, skipIfAlreadyExists: true });
    highlightTokens({ documentURI, documentText });
  }

  // Listen for opening new text documents
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      const documentURI = document.uri.toString();
      const documentText = document.getText();

      parsingFlow({ documentURI, documentText, skipIfAlreadyExists: true });
      highlightTokens({ documentURI, documentText });
    }),
  );

  // Listen for switching active editor
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor) {
        return;
      }

      const { document } = editor;
      const documentURI = document.uri.toString();
      const documentText = document.getText();

      parsingFlow({ documentURI, documentText, skipIfAlreadyExists: true });
      highlightTokens({ documentURI, documentText });
    }),
  );

  // listen for document changes if you want to recalc on edits
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(async (event) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || event.document !== editor.document) {
        return;
      }

      if (event.contentChanges.length === 0) {
        // isSuggestOpen = false;
        return;
      }

      const { document } = event;
      const documentURI = document.uri.toString();
      const documentText = document.getText();

      parsingFlow({ documentURI, documentText });
      highlightTokens({ documentURI, documentText });

      const position = editor.selection.active;
      const value = event.contentChanges[0].text;
      const tokens = findSurroundingTokens({ document: editor.document, position, value });
      if (!tokens) {
        return;
      }

      if (value.length > 1) {
        // isSuggestOpen = false;

        if (value.trim().length === 0) {
          return;
        }
      }

      if (
        (value.length === 1 && isAlphaNumeric({ str: value })) ||
        value === ":" ||
        value === "-" ||
        tokens.currentToken.type === "colon"
      ) {
        const { currentToken, propertyToken } = tokens;

        let values: readonly string[] | string[] = [];

        if (!propertyToken) {
          values = cssProperties;
        } else {
          values = cssValues[propertyToken.value as keyof typeof cssValues] ?? [];
        }

        if (currentToken && currentToken.type !== "colon") {
          const option = values.find((option) =>
            fuzzyMatch({ str: option, input: currentToken.value }),
          );

          if (!option) {
            return;
          }
        }

        // const { propertyToken, currentToken } = tokens;
        // const currentTokenValue = currentToken.value;
        // let shouldOpenAutoComplete = false;

        // if (!propertyToken) {
        //   shouldOpenAutoComplete = !!cssProperties.find((property) =>
        //     property.includes(currentTokenValue),
        //   );
        // }

        // console.log(
        //   shouldOpenAutoComplete,
        //   cssProperties.find((property) => property.includes(currentTokenValue)),
        // );

        // if (shouldOpenAutoComplete) {
        vscode.commands.executeCommand("dynaticCSS.openSuggest");

        // await vscode.languages.setTextDocumentLanguage(editor.document, "my-styled-css");

        // vscode.window.showInformationMessage(
        //   'Document changed to "test" language. Now only the test provider will work!',
        // );

        // await vscode.languages.setTextDocumentLanguage(editor.document, "typescript");
        // vscode.languages.registerInlineCompletionItemProvider("typescript", {
        //   provideInlineCompletionItems(document, position, context, token) {
        //     return cssValues["color"].map((val) => ({
        //       insertText: val,
        //       range: new vscode.Range(position, position),
        //     }));
        //   },
        // });
        // const picked = await vscode.window.showQuickPick(cssValues["color"], {
        //   placeHolder: "Select property",
        // });
        // if (!picked) return;
        // editor.insertSnippet(new vscode.SnippetString(picked), editor.selection.active);
      }
    }),
  );

  const colorProvider = activateColorProvider();
  context.subscriptions.push(colorProvider);

  vscode.window.showInformationMessage("Dynatic CSS Intellisense extension activated!");

  // vscode.window.onDidChangeWindowState((e) => {
  //   if (e.focused) {
  //     return;
  //   }

  //   // isSuggestOpen = false;
  // });

  const provider = activateAutoComplete();

  context.subscriptions.push(provider);
  // let timeout: NodeJS.Timeout;

  vscode.commands.registerCommand("dynaticCSS.openSuggest", () => {
    vscode.commands.executeCommand("editor.action.triggerSuggest");

    // isSuggestOpen = true;
  });

  vscode.commands.registerCommand("dynaticCSS.dismissSuggest", () => {
    // isSuggestOpen = false;
    vscode.commands.executeCommand("hideSuggestWidget");
  });
}

export function deactivate() {}
