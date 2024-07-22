import {
  executeTerminalCommandWithReadinessCheck,
  ExecuteTerminalCommandWithReadinessCheckArgs,
} from "../executeTerminalCommand";

type RunParalleledCommandsArgs = {
  commands: Omit<ExecuteTerminalCommandWithReadinessCheckArgs, "exitOnFailure">[];
  exitOnFailure?: boolean;
};

export const runParalleledCommands = async ({
  commands,
  exitOnFailure,
}: RunParalleledCommandsArgs) => {
  try {
    await Promise.all(
      commands.map((command) => {
        return executeTerminalCommandWithReadinessCheck({ ...command, exitOnFailure });
      }),
    );
  } catch (error) {
    console.error(error);
  }
};
