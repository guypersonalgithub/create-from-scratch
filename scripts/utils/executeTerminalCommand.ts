import { exec, execSync } from "child_process";

type ExecuteTerminalCommandArgs = {
  command: string;
};

export const executeBlockingTerminalCommand = ({
  command,
}: ExecuteTerminalCommandArgs) => {
  try {
    const output = execSync(command, { encoding: "utf8" }).toString();
    return output;
  } catch (error) {
    const isError = error instanceof Error;
    console.error(
      `Error executing command: ${isError ? error.message : error}`
    );
  }
};

export const executeTerminalCommand = async ({
  command,
}: ExecuteTerminalCommandArgs) => {
  try {
    const output = await exec(command, { encoding: "utf8" }).toString();
    return output;
  } catch (error) {
    const isError = error instanceof Error;
    console.error(
      `Error executing command: ${isError ? error.message : error}`
    );
  }
};
