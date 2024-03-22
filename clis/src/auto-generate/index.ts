import { getCommandFlags } from "utility-scripts";
import { cliOptions } from "./commandFunctions/cliOptions";

const entryPoint = async () => {
  const commands = getCommandFlags();

  if (commands.length === 0) {
    return console.error(
      "Missing a command flag! Try to add the --help flag to learn more about available options"
    );
  }

  for await (const command of commands) {
    await cliOptions({ command });
  }
};

(async () => {
  await entryPoint();
  process.exit();
})();
