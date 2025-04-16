import { getProjectAbsolutePath } from "@packages/paths";
import { getPackageJson, createPackageJson } from "@packages/package-json";
import { copyFolder } from "@packages/files";
import { createRootTSConfig, createLocalPackageTSConfig } from "@packages/tsconfig";
import { getValidatedPackageData } from "./getValidatedPackageData";
import { deleteLocalPackageDependencies } from "./deleteLocalPackageDependencies";
import { executeTerminalCommand } from "@packages/terminal-utils";
import { buildContent } from "@packages/esbuild";

type SetupPackageArgs = {
  path: string;
  destination: string;
  localPackageIdentifier?: string;
  bumpMajor?: boolean;
  bumpMinor?: boolean;
  bumpPatch?: boolean;
};

export const setupPackage = async ({
  path,
  destination,
  localPackageIdentifier = "@packages",
  bumpMajor,
  bumpMinor,
  bumpPatch,
}: SetupPackageArgs) => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const completePath = `${projectAbsolutePath}/${path}`;
  try {
    const { currentPackageName, localDependencies, packageJson, tsconfig } =
      getValidatedPackageData({
        path,
        localPackageIdentifier,
        projectAbsolutePath,
        completePath,
      });

    const publishedPackagesFolderPath = `${projectAbsolutePath}/published-packages`;
    const newDestination = `${publishedPackagesFolderPath}/${destination}`;

    const previousPackageJsonPath = `${newDestination}/package.json`;
    const previousPackageJson = getPackageJson({ packagePath: previousPackageJsonPath });
    let version;
    if (previousPackageJson) {
      const { version: currentVersion } = previousPackageJson;
      version = currentVersion;

      const shouldBumpVersion = bumpMajor || bumpMinor || bumpPatch;
      if (shouldBumpVersion) {
        const [major, minor, patch] = version.split(".");
        if (bumpMajor) {
          version = `${major + 1}.0.0`;
        } else if (bumpMinor) {
          version = `${major}.${minor + 1}.0`;
        } else {
          version = `${major}.${minor}.${patch + 1}`;
        }
      }
    }

    const {
      compilerOptions: { jsx },
    } = tsconfig;

    copyFolder({
      src: completePath,
      dest: newDestination,
      skip: ({ filePath }) => {
        const skips = [
          `\\${currentPackageName}\\package.json`,
          `\\${currentPackageName}\\tests.yaml.config.ts`,
          `\\${currentPackageName}\\tsconfig.json`,
          "node_modules",
          ".gitignore",
        ];

        const shouldSkip = !!skips.find((skip) => filePath.includes(skip));
        return shouldSkip;
      },
    });

    const { dependencies, devDependencies, optionalDependencies, peerDependencies } =
      deleteLocalPackageDependencies({ packageJson, localPackageIdentifier });

    const { scripts } = packageJson;

    createPackageJson({
      path: previousPackageJsonPath,
      name: currentPackageName,
      version,
      type: "module",
      dependencies,
      devDependencies,
      optionalDependencies,
      peerDependencies,
      scripts,
      main: "./dist/index.mjs",
      module: "./dist/index.mjs",
      types: "./types/src/index.d.ts",
      exports: {
        ".": {
          import: "./dist/index.mjs",
          types: "./types/src/index.d.ts",
        },
      },
      files: ["dist", "types/src", "README.md"],
    });
    createRootTSConfig({
      path: `${newDestination}/tsconfig.json`,
      jsxPackage: !!jsx,
      references: localDependencies.map((pack) => ({ path: pack.path })),
      compilerOptions: {
        emitDeclarationOnly: true,
        composite: true,
        outDir: "./types",
      },
    });

    for (const localDependency of localDependencies) {
      const { path } = localDependency;
      const completePath = `${projectAbsolutePath}/${path}`;
      const newPath = `${newDestination}/${path}`;

      copyFolder({
        src: completePath,
        dest: newPath,
        skip: ({ filePath }) => {
          const skips = [
            `\\${currentPackageName}\\tests.yaml.config.ts`,
            `\\${currentPackageName}\\tsconfig.json`,
            "node_modules",
            ".gitignore",
          ];

          const shouldSkip = !!skips.find((skip) => filePath.includes(skip));
          return shouldSkip;
        },
      });

      createLocalPackageTSConfig({ path: newPath });
    }

    executeTerminalCommand({ command: `cd ${newDestination} && npm ci` });
    executeTerminalCommand({ command: `cd ${newDestination} && npm run build` });

    await buildContent({
      entryPoints: [`${newDestination}/src/index.ts`],
      format: "esm",
      outfile: `${newDestination}/dist/index.mjs`,
    });
  } catch (error) {
    console.error(error);
  }
};

// example: auto-generate --setup-package path=dev-packages/yaml dest=js-to-yaml
