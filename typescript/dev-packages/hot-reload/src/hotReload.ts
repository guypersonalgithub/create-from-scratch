import { readdirSync, watchFile } from "fs";
import { join } from "path";
import { spawn, ChildProcess } from "child_process";

const entry: string | undefined = process.argv[2];
if (!entry) {
  console.error("Usage: hotReload.ts <script>");
  process.exit(1);
}

let child: ChildProcess | null = null;

const startProcess = () => {
  if (child) {
    child.kill();
  }

  console.log(`\n[Watcher] Starting ${entry}...\n`);
  child = spawn("node", [entry], { stdio: "inherit" });
};

type WatchDirArgs = {
  dir: string;
  watched?: Set<string>;
};

const watchDir = ({ dir, watched = new Set<string>() }: WatchDirArgs) => {
  if (watched.has(dir)) {
    return;
  }
  watched.add(dir);

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const filepath = join(dir, entry.name);

    if (entry.isDirectory()) {
      watchDir({ dir: filepath, watched });
    } else if (entry.isFile()) {
      watchFile(filepath, { interval: 300 }, () => {
        console.log(`[Watcher] File changed: ${filepath}`);
        startProcess();
      });
    }
  }
};

startProcess();
watchDir({ dir: process.cwd() });
