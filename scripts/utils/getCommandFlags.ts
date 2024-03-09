type GetCommandFlagsArgs = {
  singleKeyValue: boolean;
};

export type Command = { key: string; value: string[] };

export const getCommandFlags = (args?: GetCommandFlagsArgs) => {
  const { singleKeyValue } = args || {};

  const { argv } = process;
  const flags = argv.slice(2);

  if (flags.length === 0) {
    return [];
  }

  const commands = splitToCommands({ flags });

  if (singleKeyValue) {
    return [commands[0]];
  }

  return commands;
};

type SplitToCommandsArgs = {
  flags: string[];
};

const splitToCommands = ({ flags }: SplitToCommandsArgs) => {
  const commands: Command[] = [];

  for (let i = 0; i < flags.length; i++) {
    const current = flags[i];
    const isFlag = current.includes("--");
    if (!isFlag && commands.length === 0) {
      console.error(
        `Skipped a received unexpected value without flag key - ${current}`
      );
      continue;
    }

    if (isFlag) {
      commands.push({ key: current, value: [] });
      continue;
    }

    commands[commands.length - 1].value.push(current);
  }

  return commands;
};
