import { loadTestsFromDir } from "@packages/test/loadTestsFromDir";
import { loadTestsFromFile } from "@packages/test/loadTestsFromFile";
import { run } from "@packages/test/runner";
import { resolve } from "path";
import { getFlags } from "@packages/utils";

const entryPoint = async () => {
  const commands = getFlags();

  if (commands.length === 0) {
    const testsDir = resolve(process.cwd(), "tests");
    await loadTestsFromDir({ dir: testsDir });
  } else {
    const foldersCommand = commands.find((command) => command.key === "folders");
    if (foldersCommand) {
      const { value } = foldersCommand;
      await Promise.all(
        value.map((folderPath) => {
          return loadTestsFromDir({ dir: resolve(folderPath, "tests") });
        }),
      );
    }

    const pathsCommand = commands.find((command) => command.key === "paths");
    if (pathsCommand) {
      const { value } = pathsCommand;
      const testsDir = resolve(process.cwd(), "tests");

      await Promise.all(
        value.map((filePath) => {
          return loadTestsFromFile({ filePath: `${testsDir}/${filePath}` });
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
