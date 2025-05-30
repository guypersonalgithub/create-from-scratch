import { loadTestsFromDir } from "@packages/test/loadTestsFromDir";
import { run } from "@packages/test/runner";
import { resolve } from "path";
import { getFlags } from "@packages/utils";

const entryPoint = async () => {
  const commands = getFlags();

  if (commands.length === 0) {
    const testsDir = resolve(process.cwd(), "tests");
    await loadTestsFromDir({ dir: testsDir });
  } else {
    const pathCommand = commands.find((command) => command.key === "--path");
    if (pathCommand) {
      const { value } = pathCommand;
      await Promise.all(
        value.map((path) => {
          return loadTestsFromDir({ dir: resolve(path, "tests") });
        }),
      );
    }
  }

  await run();
};

(async () => {
  await entryPoint().catch((err) => {
    console.error(err);
    process.exit(1);
  });
  process.exit();
})();
