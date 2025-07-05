import { getFlags } from "@packages/utils";
import { watcher } from "@packages/watcher";

const entryPoint = async () => {
  const commands = getFlags();

  if (commands.length === 0) {
    return;
  }

  const pathsCommand = commands.find((command) => command.key === "paths");
  if (pathsCommand) {
    const { value } = pathsCommand;
    watcher({ paths: value, callback: ({ filename }) => console.log(filename) });
  }
};

(async () => {
  await entryPoint().catch((err) => {
    console.error(err);
    process.exit(1);
  });
})();
