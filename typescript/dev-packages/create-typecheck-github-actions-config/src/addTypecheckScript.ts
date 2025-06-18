import { getPackageJson } from "@packages/package-json";
import { writeFileSync } from "fs";

type AddTypecheckScriptArgs = {
  folderPath: string;
};

export const addTypecheckScript = ({ folderPath }: AddTypecheckScriptArgs) => {
  const packageJson = getPackageJson({ folderPath });

  if (!packageJson) {
    return;
  }

  const { scripts = {} } = packageJson;
  scripts.typecheck = "tsc --noEmit -p .";
  packageJson.scripts = scripts;

  writeFileSync(`${folderPath}/package.json`, JSON.stringify(packageJson, null, 2));
};
