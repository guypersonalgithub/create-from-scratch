import { type WatchEventType } from "fs";

type WatcherCallbackArgs = {
  event: WatchEventType;
  filename: string | null;
};

export type WatcherCallback = (args: WatcherCallbackArgs) => void;
