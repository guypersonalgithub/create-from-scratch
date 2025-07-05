import { mkdirSync, writeFileSync } from "fs";
import { getProjectAbsolutePath } from "@packages/paths";
import { createTypecheckGithubActionsConfig } from "@packages/create-typecheck-github-actions-config";

type GenerateCLIArgs = {
  cliName: string;
};

export const generateCLI = ({ cliName }: GenerateCLIArgs) => {
  console.log("Generating new CLI:");

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPathBase = `${projectAbsolutePath}/clis`;
  const folderPath = `${folderPathBase}/${cliName}`;
  const cliSrc = `${folderPath}/src`;
  const cliPackageJson = `${folderPath}/package.json`;
  const cliTSConfig = `${folderPath}/tsconfig.json`;
  const cliIndex = `${cliSrc}/index.ts`;
  const cliIndexJS = `${folderPath}/index.js`;

  mkdirSync(folderPath);
  console.log(`Created ${folderPath}`);
  mkdirSync(cliSrc);
  console.log(`Created ${cliSrc}`);

  writeFileSync(
    cliPackageJson,
    JSON.stringify(
      {
        name: cliName,
        version: "1.0.0",
        description: "",
        type: "module",
        scripts: {
          build: "tsc -b .",
          typecheck: "tsc --noEmit -p .",
        },
        author: "",
        license: "ISC",
        bin: {
          [cliName]: "index.js",
        },
      },
      null,
      2,
    ),
  );
  console.log(`Created ${cliPackageJson}`);
  writeFileSync(
    cliTSConfig,
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
  console.log(`Created ${cliTSConfig}`);

  writeFileSync(
    cliIndexJS,
    `#!/usr/bin/env node
import { initiateCli } from "../utils/runTypescriptCLI.js";

initiateCli("${cliName}/src/index.ts");`,
  );
  console.log(`Created ${cliIndexJS}`);

  createTypecheckGithubActionsConfig({
    folderName: cliName,
    folderPath: folderPathBase,
    folder: `clis/${cliName}`,
  });
  console.log(`Created ${folderPath}/typecheck.yaml.config.ts`);

  writeFileSync(cliIndex, "");
  console.log(`Created ${cliIndex}`);
};
