import { getCommandFlags } from "utility-scripts";
import { cliOptions } from "./commandFunctions/cliOptions";

const entryPoint = () => {
  const commands = getCommandFlags();

  if (commands.length === 0) {
    return console.error(
      "Missing a command flag! Try to add the --help flag to learn more about available options"
    );
  }

  commands.forEach(async (command) => {
    await cliOptions({ command });
  });
};

entryPoint();
process.exit();
