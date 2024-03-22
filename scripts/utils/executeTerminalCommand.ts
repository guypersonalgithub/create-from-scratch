import { execSync, spawn } from "child_process";

type ExecuteTerminalCommandArgs = {
  command: string;
};

export const executeTerminalCommand = ({
  command,
}: ExecuteTerminalCommandArgs) => {
  try {
    execSync(command, {
      encoding: "utf-8",
      stdio: "inherit",
    });
  } catch (error) {
    const isError = error instanceof Error;
    console.error(
      `Error executing command: ${isError ? error.message : error}`
    );
  }
};

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

type ExecuteTerminalCommandWithOutputArgs = {
  command: string;
};

export const executeTerminalCommandWithOutput = async ({
  command,
}: ExecuteTerminalCommandWithOutputArgs) => {
  const childProcess = spawn(command, {
    shell: true,
    stdio: "pipe",
  });

  let output = "";

  const handleStdout = (data: BinaryData) => {
    const strData = data.toString();
    const coloredOutput = strData
      .replace(/error/i, colors.red + "$&" + colors.reset)
      .replace(/success/i, colors.green + "$&" + colors.reset);
    output += coloredOutput;
    process.stdout.write(coloredOutput);
  };

  const handleStderr = (data: BinaryData) => {
    const strData = data.toString();
    const coloredOutput = colors.red + strData + colors.reset;
    output += coloredOutput;
    process.stderr.write(coloredOutput);
  };

  childProcess.stdout.on("data", handleStdout);
  childProcess.stderr.on("data", handleStderr);

  await new Promise((resolve) => {
    childProcess.on("close", (exitCode) => {
      if (exitCode !== 0) {
        console.error(`Command failed with exit code ${exitCode}`);
      }
      resolve(output);
    });
  });

  return output;
};
