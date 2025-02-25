import { getFile } from "@packages/files";

type ReadArgs = {
  filePath: string;
};

export const read = async ({ filePath }: ReadArgs) => {
  const file = await getFile({ path: filePath });
  console.dir(file, { depth: null });
};

read({ filePath: "" });
