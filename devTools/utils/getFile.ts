import { readFileSync } from "fs";

type GetFileArgs = {
  path: string;
};

export const getFile = ({ path }: GetFileArgs) => {
  try {
    return readFileSync(path, {
      encoding: "utf-8",
    });
  } catch (error) {
    return;
  }
};
