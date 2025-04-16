import { TSConfig } from "./types";
import { writeFileSync } from "fs";

type CreateTSConfigArgs = TSConfig & { path: string };

export const createTSConfig = async ({ path, ...rest }: CreateTSConfigArgs) => {
  if (!path) {
    throw new Error("Missing package json path");
  }

  const tsconfig = rest;

  writeFileSync(path, JSON.stringify(tsconfig, null, 2));
};
