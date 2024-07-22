import {
  executeTerminalCommandWithReadinessCheck,
  ExecuteTerminalCommandWithReadinessCheckArgs,
} from "../executeTerminalCommand";

type RunSequencedCommandsArgs = {
  commands: Omit<ExecuteTerminalCommandWithReadinessCheckArgs, "exitOnFailure">[];
  exitOnFailure?: boolean;
};

export const runSequencedCommands = async ({
  commands,
  exitOnFailure,
}: RunSequencedCommandsArgs) => {
  try {
    for await (const command of commands) {
      await executeTerminalCommandWithReadinessCheck({ ...command, exitOnFailure });
    }
  } catch (error) {
    console.error(error);
  }
};
