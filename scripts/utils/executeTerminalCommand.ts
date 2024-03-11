import { execSync } from "child_process";

type ExecuteTerminalCommandArgs = {
  command: string;
};

export const executeTerminalCommand = ({
  command,
}: ExecuteTerminalCommandArgs) => {
  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: "inherit",
    });
    return output;
  } catch (error) {
    const isError = error instanceof Error;
    console.error(
      `Error executing command: ${isError ? error.message : error}`
    );
  }
};
