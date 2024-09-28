import { multiSelect } from "@packages/terminal-multi-select";
import { executeTerminalCommand, getUserInput } from "@packages/terminal-utils";
import { generatePackage } from "@packages/packages";
import {
  detectRepositoryPackageManager,
  getPackageManagerInstallCommand,
} from "@packages/package-manager";

type GenerateAndInstallPackageArgs = {
  value: string[];
};

export const generateAndInstallPackage = async ({ value }: GenerateAndInstallPackageArgs) => {
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
      `Received a package name with a space, which is not a format ${packageManager} supports.`,
    );
    return;
  }

  const selectedOptions = await multiSelect({
    options: [
      {
        value: "packages",
        label: "packages",
      },
      {
        value: "dev-packages",
        label: "dev-packages",
      },
    ],
    prefixText: "Please pick the folder where you'd like to place the new package at:\n",
    suffixText: "\nPress Enter to confirm",
  });

  const pickedOption = selectedOptions[0];

  const name = value[0];
  generatePackage({ packageName: name, folder: pickedOption.value as "packages" | "dev-packages" });
  const command = getPackageManagerInstallCommand({ packageManager });
  await executeTerminalCommand({ command });
};
