import { TSConfig } from "./types";
import { getFile } from "@packages/files";

type GetgetTSconfigArgs = {
  packagePath: string;
};

export const getTSconfig = ({ packagePath }: GetgetTSconfigArgs) => {
  try {
    const stringifiedTSconfigJson = getFile({ path: `${packagePath}/tsconfig.json` });
    if (!stringifiedTSconfigJson) {
      throw "The tsconfig json file was not found.";
    }
    const TSconfigJson = JSON.parse(stringifiedTSconfigJson) as TSConfig;
    return TSconfigJson;
  } catch (error) {
    console.error(error);
  }
};
