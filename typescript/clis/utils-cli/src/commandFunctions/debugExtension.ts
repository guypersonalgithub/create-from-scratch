import { detectRepositoryPackageManager } from "@packages/package-manager";
import { getProjectAbsolutePath } from "@packages/paths";
import { executeTerminalCommand, getUserInput } from "@packages/terminal-utils";

type DebugExtensionArgs = {
  value: string[];
};

export const debugExtension = async ({ value }: DebugExtensionArgs) => {
  if (value.length === 0) {
    const userInput = await getUserInput({
      message: "Please enter package name:",
    });
    const splitBySpaces = userInput.split(" ");
    splitBySpaces.forEach((word) => {
      value.push(word);
    });
  }

  const packageManager = detectRepositoryPackageManager().manager;

  if (value.length > 1) {
    console.error(
      `Received an extension name with a space, which is not a format ${packageManager} supports.`,
    );

    return;
  }

  const extensionName = value[0];

  const projectAbsolutePath = getProjectAbsolutePath();
  const path = `${projectAbsolutePath}/vscode-extensions/${extensionName}`;
  const command = `code ${path}`;
  await executeTerminalCommand({ command });
};
