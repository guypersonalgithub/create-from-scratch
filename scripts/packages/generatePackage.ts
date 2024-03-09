import { mkdirSync, writeFileSync } from "fs";
import { getProjectAbsolutePath } from "../utils";

type GeneratePackageArgs = {
  packageName: string;
};

export const generatePackage = ({ packageName }: GeneratePackageArgs) => {
  console.log(`Generating new package:`);

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPath = `${projectAbsolutePath}/packages/${packageName}`;

  mkdirSync(folderPath);
  mkdirSync(`${folderPath}/src`);
  writeFileSync(
    `${folderPath}/package.json`,
    JSON.stringify(
      {
        name: `@packages/${packageName}`,
        version: "1.0.0",
        description: "",
        type: "commonjs",
        scripts: {
          build: "tsc -b .",
        },
        author: "",
        license: "ISC",
        main: "./src/index.ts",
      },
      null,
      2
    )
  );
  writeFileSync(
    `${folderPath}/tsconfig.json`,
    JSON.stringify(
      {
        compilerOptions: {
          target: "es6",
          module: "commonjs",
          rootDir: "./src",
          moduleResolution: "node",
          outDir: "./dist",
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true,
          declaration: true,
        },
        include: ["src"],
      },
      null,
      2
    )
  );
  writeFileSync(`${folderPath}/src/index.ts`, "");
};
