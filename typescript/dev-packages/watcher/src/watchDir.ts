import { readdirSync, type FSWatcher } from "fs";
import { join } from "path";
import { isPathFolder } from "@packages/files";
import { watchFile } from "./watchFile";
import type { WatcherCallback } from "./types";

type WatchDirArgs = {
  path: string;
  callback: WatcherCallback;
};

export const watchDir = ({ path, callback }: WatchDirArgs) => {
  const watchers: FSWatcher[] = [];
  const files = readdirSync(path);

  for (const file of files) {
    const full = join(path, file);
    if (isPathFolder({ path: full })) {
      watchers.push(...watchDir({ path: full, callback }));
    } else {
      const w = watchFile({ path, callback });
      watchers.push(w);
    }
  }

  return watchers;
};
