import { type Option, multiSelect } from "@packages/terminal-multi-select";
import { cliOptions } from "./commandFunctions/cliOptions";
import { SupportedCommands } from "./commandFunctions/supportedCommands";
import { getFlags } from "@packages/utils";

const entryPoint = async () => {
  const commands = getFlags();

  if (commands.length === 0) {
    const options: Option[] = [];

    for (const command in SupportedCommands) {
      const value = SupportedCommands[command as keyof typeof SupportedCommands];

      options.push({
        value,
        label: value,
      });
    }

    const selectedOptions = await multiSelect({
      options,
      prefixText: "Please pick the option you'd like to use:\n",
      suffixText: "\nPress Enter to confirm",
    });

    selectedOptions.forEach((option) => {
      commands.push({
        key: option.value,
        value: [],
      });
    });
  }

  for await (const command of commands) {
    try {
      await cliOptions({ command });
    } catch (error) {
      console.log(`The command ${command.key} - ${command.value} has failed.
      Error: ${error}`);
    }
  }
};

(async () => {
  await entryPoint();
  process.exit();
})();
