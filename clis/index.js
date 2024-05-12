#!/usr/bin/env node
import { execSync } from "child_process";
import { platform } from "os";
import { fileURLToPath } from "url";
import { dirname } from "path";

const runScript = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const isWindows = platform() === "win32";
  const command = isWindows ? "index.bat" : "index.sh";
  const { argv } = process;
  const flags = argv.slice(2);

  execSync(`${__dirname}/${command} ${flags.join(" ")}`, {
    encoding: "utf-8",
    stdio: "inherit",
  });
};

runScript();
