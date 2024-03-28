import { appendFileSync, writeFileSync } from "fs";
import { getProjectAbsolutePath } from "../utils";

type InsertPackageTypesArgs = {
  packageName: string;
  dbTypes: string[];
};

export const insertPackageTypes = ({
  packageName,
  dbTypes,
}: InsertPackageTypesArgs) => {
  const absolutePath = getProjectAbsolutePath();
  const srcPath = `${absolutePath}/packages/${packageName}/src`;
  writeFileSync(`${srcPath}/types.ts`, dbTypes.join("\r\n\r\n"));
  appendFileSync(`${srcPath}/index.ts`, `export * from "./types";`);
};
