import { executeTerminalCommand, getUserInput } from "@packages/terminal-utils";
import {
  detectRepositoryPackageManager,
  getPackageManagerInstallCommand,
} from "@packages/package-manager";
import { generateCLI } from "@packages/clis";

type GenerateAndInstallCLIArgs = {
  value: string[];
};

export const generateAndInstallCLI = async ({ value }: GenerateAndInstallCLIArgs) => {
  if (value.length === 0) {
    const userInput = await getUserInput({
      message: "Please enter cli name:",
    });
    const splitBySpaces = userInput.split(" ");
    splitBySpaces.forEach((word) => {
      value.push(word);
    });
  }

  const packageManager = detectRepositoryPackageManager().manager;

  if (value.length > 1) {
    console.error(
      `Received a cli name with a space, which is not a format ${packageManager} supports.`,
    );

    return;
  }

  const name = value[0];
  generateCLI({ cliName: name });
  const command = getPackageManagerInstallCommand({ packageManager });
  await executeTerminalCommand({ command });
};
