import { spawn } from "child_process";
import { resolve, dirname, join, parse } from "path";
import { existsSync } from "fs";

const getProjectAbsolutePath = () => {
  const rootMarker = "node_modules";

  let dir = process.cwd();

  while (dir !== parse(dir).root) {
    if (existsSync(join(dir, rootMarker))) {
      return dir;
    }
    dir = dirname(dir);
  }

  throw new Error("Project root not found");
};

export const initiateCli = (typescriptEntryPoint) => {
  const projectAbsolutePath = getProjectAbsolutePath();

  const cliPath = `${projectAbsolutePath}/clis/${typescriptEntryPoint}`;

  const extraArgs = process.argv.slice(2);

  const child = spawn(
    process.execPath, // This is `node`
    [resolve(`${projectAbsolutePath}/node_modules/tsx/dist/cli.mjs`), cliPath, ...extraArgs],
    {
      stdio: "inherit",
    },
  );

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
};
