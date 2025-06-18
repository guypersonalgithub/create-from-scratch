import { getFlags } from "@packages/utils";
import { getPackageJson } from "@packages/package-json";
import { writeFileSync } from "fs";

const removeLocalExports = () => {
  const flags = getFlags();
  const path = flags[0];
  if (!path || path.key !== "--path") {
    return;
  }

  const { value } = path;
  const packageJsonPath = value[0];
  const packageJson = getPackageJson({ folderPath: packageJsonPath });
  if (!packageJson) {
    return;
  }

  const { exports } = packageJson;

  if (!exports) {
    return;
  }

  const shallowDuplication = { ...exports };

  for (const path in exports) {
    if (path.includes("local")) {
      delete shallowDuplication[path];
    }
  }

  packageJson.exports = shallowDuplication;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

removeLocalExports();
