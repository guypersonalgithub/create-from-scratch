import { pathToFileURL } from "node:url";

type GetModuleExportsArgs = {
  filePath: string;
};

export const getModuleExports = async ({ filePath }: GetModuleExportsArgs) => {
  const fileUrl = pathToFileURL(filePath).href;
  const module = await import(fileUrl);
  return module;
};
