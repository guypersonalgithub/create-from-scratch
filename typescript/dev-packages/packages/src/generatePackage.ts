import { mkdirSync, writeFileSync } from "fs";
import { getProjectAbsolutePath } from "@packages/paths";
import { createTypecheckGithubActionsConfig } from "@packages/create-typecheck-github-actions-config";

type GeneratePackageArgs = {
  packageName: string;
  folder: "packages" | "dev-packages";
};

export const generatePackage = ({ packageName, folder }: GeneratePackageArgs) => {
  console.log("Generating new package:");

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPathBase = `${projectAbsolutePath}/${folder}`;
  const folderPath = `${folderPathBase}/${packageName}`;
  const packageSrc = `${folderPath}/src`;
  const packagePackageJson = `${folderPath}/package.json`;
  const packageTSConfig = `${folderPath}/tsconfig.json`;
  const packageIndex = `${folderPath}/src/index.ts`;

  mkdirSync(folderPath);
  console.log(`Created ${folderPath}`);
  mkdirSync(packageSrc);
  console.log(`Created ${packageSrc}`);
  const baseEntryPoint = "./src/index.ts";
  writeFileSync(
    packagePackageJson,
    JSON.stringify(
      {
        name: `@packages/${packageName}`,
        version: "1.0.0",
        description: "",
        type: "module",
        scripts: {
          build: "tsc -b .",
          typecheck: "tsc --noEmit -p .",
        },
        author: "",
        license: "ISC",
        main: baseEntryPoint,
        module: baseEntryPoint,
        exports: {
          ".": baseEntryPoint,
        },
      },
      null,
      2,
    ),
  );
  console.log(`Created ${packagePackageJson}`);
  writeFileSync(
    packageTSConfig,
    JSON.stringify(
      {
        extends: "../../tsconfig.json",
        compilerOptions: {
          rootDir: "./src",
          outDir: "./dist",
        },
        include: ["./src"],
      },
      null,
      2,
    ),
  );
  console.log(`Created ${packageTSConfig}`);

  createTypecheckGithubActionsConfig({
    folderName: packageName,
    folderPath: folderPathBase,
    folder: `${folder}/${packageName}`,
  });
  console.log(`Created ${folderPath}/typecheck.yaml.config.ts`);

  writeFileSync(packageIndex, "");
  console.log(`Created ${packageIndex}`);
};
