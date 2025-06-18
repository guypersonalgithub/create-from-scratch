import { type ChildProcess, exec, execSync, spawn } from "child_process";
import type { ProcessData } from "./types";

type ExecuteTerminalCommandArgs = {
  command: string;
};

export const executeTerminalCommand = ({ command }: ExecuteTerminalCommandArgs) => {
  try {
    return execSync(command, {
      encoding: "utf-8",
      stdio: "inherit",
    });
  } catch (error) {
    const isError = error instanceof Error;
    console.error(`Error executing command: ${isError ? error.message : error}`);
  }
};

export const executeTerminalCommandWithResponse = ({
  command,
}: ExecuteTerminalCommandArgs): Promise<string | undefined> | undefined => {
  try {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`error: ${error.message}`);
        } else if (stderr) {
          reject(`stderr: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  } catch (error) {
    const isError = error instanceof Error;
    console.error(`Error executing command: ${isError ? error.message : error}`);
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

  const handleStdout = (data: ProcessData) => {
    const strData = data.toString();
    const coloredOutput = strData
      .replace(/error/i, colors.red + "$&" + colors.reset)
      .replace(/success/i, colors.green + "$&" + colors.reset);
    output += coloredOutput;
    process.stdout.write(coloredOutput);
  };

  const handleStderr = (data: ProcessData) => {
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

export type ExecuteTerminalCommandWithReadinessCheckArgs = {
  command: string;
  args: string[];
  processName?: string;
  readinessCheckString?: string;
  exitOnFailure?: boolean;
  withLogs?: boolean;
};

export const executeTerminalCommandWithReadinessCheck = ({
  command,
  args,
  processName,
  readinessCheckString,
  exitOnFailure,
  withLogs,
}: ExecuteTerminalCommandWithReadinessCheckArgs): Promise<{
  process: ChildProcess;
  logs?: string[];
}> => {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"], shell: true });
    const logs: string[] | undefined = withLogs ? [] : undefined;

    proc.stdout.on("data", (data: Buffer) => {
      const message = data.toString();
      const log = processName ? `[${processName}]:\r\n${message}` : message;
      console.log(log);
      if (withLogs) {
        logs?.push(log);
      }

      if (checkReadiness({ readinessCheckString, message })) {
        resolve({ process: proc, logs });
      }
    });

    proc.stderr.on("data", (data: Buffer) => {
      const errorLog = processName
        ? `[${processName} ERROR]:\r\n${data.toString()}`
        : `[ERROR]:\r\n${data.toString()}`;
      console.error(errorLog);
      if (withLogs) {
        logs?.push(errorLog);
      }
    });

    proc.on("close", (code: number) => {
      if (code !== 0) {
        reject(new Error(`Command ${command} ${args.join(" ")} exited with code ${code}`));
        if (exitOnFailure) {
          process.exit();
        }
      } else {
        resolve({ process: proc, logs });
      }
    });

    proc.on("error", (error: Error) => {
      reject(error);
      if (exitOnFailure) {
        process.exit();
      }
    });
  });
};

type CheckReadinessArgs = {
  readinessCheckString?: string;
  message: string;
};

const checkReadiness = ({ readinessCheckString, message }: CheckReadinessArgs) => {
  if (!readinessCheckString) {
    return false;
  }

  return message.includes(readinessCheckString);
};
