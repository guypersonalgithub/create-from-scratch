import { debounce } from "@packages/utils";
import { watch } from "fs";
import type { WatcherCallback } from "./types";

type WatchFileArgs = {
  path: string;
  callback: WatcherCallback;
};

export const watchFile = ({ path, callback }: WatchFileArgs) => {
  const { set } = debounce();

  return watch(path, (event, filename) => {
    set({ callback: () => callback({ event, filename }) });
  });
};
