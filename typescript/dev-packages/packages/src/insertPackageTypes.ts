import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { getProjectAbsolutePath } from "@packages/paths";

type InsertPackageTypesArgs = {
  packageName: string;
  dbTypes: string[];
};

export const insertPackageTypes = ({ packageName, dbTypes }: InsertPackageTypesArgs) => {
  const absolutePath = getProjectAbsolutePath();
  const srcPath = `${absolutePath}/packages/${packageName}/src`;
  const typesPath = `${srcPath}/types.ts`;
  const typesFileAlreadyExists = existsSync(typesPath);
  writeFileSync(typesPath, dbTypes.join("\r\n\r\n"));
  console.log(`${!typesFileAlreadyExists ? "Created" : "Updated"} ${typesPath}`);
  const indexPath = `${srcPath}/index.ts`;
  const indexFile = readFileSync(indexPath, "utf-8");
  const typesExport = `export * from "./types";`;
  if (indexFile.includes(typesExport)) {
    return;
  }
  const isIndexEmpty = indexFile.length === 0;
  appendFileSync(indexPath, isIndexEmpty ? typesExport : `\r\n${typesExport}`);
  console.log(`Updated ${indexPath}`);
};
