import {
  executeTerminalCommand,
  generatePackage,
  getUserInput,
} from "utility-scripts";

type GenerateAndInstallPackageArgs = {
  value: string[];
};

export const generateAndInstallPackage = async ({
  value,
}: GenerateAndInstallPackageArgs) => {
  if (value.length === 0) {
    const userInput = await getUserInput({
      message: "Please enter package name:",
    });
    const splitBySpaces = userInput.split(" ");
    splitBySpaces.forEach((word) => {
      value.push(word);
    });
  }

  if (value.length > 1) {
    console.error(
      "Received a package name with a space, which is not a format npm supports."
    );
    return;
  }

  const name = value[0];
  generatePackage({ packageName: name });
  await executeTerminalCommand({ command: "npm i" });
};
