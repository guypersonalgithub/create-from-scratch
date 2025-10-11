import { buildExtension } from "@packages/extension-builder";

buildExtension({
  extensionName: "dynatic-css-intellisense",
  externalPackages: ["vscode", "typescript"],
});
