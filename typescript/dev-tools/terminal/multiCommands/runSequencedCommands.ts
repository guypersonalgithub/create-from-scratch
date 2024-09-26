import {
  executeTerminalCommandWithReadinessCheck,
  ExecuteTerminalCommandWithReadinessCheckArgs,
} from "../executeTerminalCommand";

export type RunSequencedCommandsArgs = {
  commands: (Omit<ExecuteTerminalCommandWithReadinessCheckArgs, "exitOnFailure"> & {
    updateArgsBasedOffPreviousCommandLogs?: ({ args, logs }: { args: string[]; logs: string[] }) => string[];
  })[];
  exitOnFailure?: boolean;
};

export const runSequencedCommands = async ({
  commands,
  exitOnFailure,
}: RunSequencedCommandsArgs) => {
  try {
    let previousLogs: string[] = [];
    for await (const command of commands) {
      const { args, withLogs, updateArgsBasedOffPreviousCommandLogs } = command;
      let updatedArgs = args;

      if (updateArgsBasedOffPreviousCommandLogs) {
        updatedArgs = updateArgsBasedOffPreviousCommandLogs({ args, logs: previousLogs });
      }
      
      const { logs } = await executeTerminalCommandWithReadinessCheck({
        ...command,
        args: updatedArgs,
        exitOnFailure,
      });

      if (withLogs && logs) {
        previousLogs = logs;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
