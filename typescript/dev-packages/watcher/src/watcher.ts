import { isPathFolder } from "@packages/files";
import { watchDir } from "./watchDir";
import { type FSWatcher } from "fs";
import { watchFile } from "./watchFile";
import type { WatcherCallback } from "./types";

const activeWatchers: FSWatcher[] = [];

type WatcherArgs = {
  paths: string[];
  callback: WatcherCallback;
};

export const watcher = ({ paths, callback }: WatcherArgs) => {
  paths.forEach((path) => {
    if (isPathFolder({ path })) {
      const watchers = watchDir({ path, callback });
      activeWatchers.push(...watchers);
    } else {
      const w = watchFile({ path, callback });
      activeWatchers.push(w);
    }
  });

  process.on("SIGINT", () => {
    console.log("Shutting down...");
    activeWatchers.forEach((w) => w.close());
    process.exit(0);
  });
};
