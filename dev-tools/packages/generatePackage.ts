import { mkdirSync, writeFileSync } from "fs";
import { getProjectAbsolutePath } from "../paths";

type GeneratePackageArgs = {
  packageName: string;
  folder: "packages" | "dev-packages";
};

export const generatePackage = ({ packageName, folder }: GeneratePackageArgs) => {
  console.log(`Generating new package:`);

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPath = `${projectAbsolutePath}/${folder}/${packageName}`;
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
        compilerOptions: {
          target: "es6",
          module: "ES2020",
          rootDir: "./src",
          moduleResolution: "node",
          outDir: "./dist",
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true,
          declaration: true,
        },
        include: ["./src"],
      },
      null,
      2,
    ),
  );
  console.log(`Created ${packageTSConfig}`);
  writeFileSync(packageIndex, "");
  console.log(`Created ${packageIndex}`);
};
