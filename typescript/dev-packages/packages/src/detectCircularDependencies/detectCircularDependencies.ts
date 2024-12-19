import { getProjectAbsolutePath } from "@packages/paths";
import { getRootPackageLock } from "../getRootPackageLock";
import { DetectCircularDependenciesArgs } from "./types";
import { specificPackagesCircularDependencies } from "./specificPackagesCircularDependencies";
import { completePackagesCircularDependencies } from "./completePackagesCircularDependencies";
import { existsSync, readdirSync, readFileSync } from "fs";
import {
  setTerminalTextColors,
  TerminalTextColors,
  resetTerminalAttributes,
} from "@packages/terminal-utils";
import { getCurrentCircularDependencyPackageName } from "./utils";

export const detectCircularDependencies = (args?: DetectCircularDependenciesArgs) => {
  const {
    localPackageFolders = ["packages", "dev-packages"],
    dependencyTypes = [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ],
    localPackageIdentifier = "@packages",
    specificPackages,
    mapProblematicPackageImports,
  } = args ?? {};

  try {
    const projectAbsolutePath = getProjectAbsolutePath();
    const problematicPackagesPaths: string[] = [];

    const parsedRootPackageLock = getRootPackageLock({ projectAbsolutePath });
    const packageLockPackages = parsedRootPackageLock["packages"];

    if (specificPackages && specificPackages.length > 0) {
      specificPackagesCircularDependencies({
        localPackageFolders,
        dependencyTypes,
        localPackageIdentifier,
        specificPackages,
        problematicPackagesPaths,
        projectAbsolutePath,
        packageLockPackages,
      });
    } else {
      completePackagesCircularDependencies({
        localPackageFolders,
        dependencyTypes,
        localPackageIdentifier,
        problematicPackagesPaths,
        projectAbsolutePath,
      });
    }

    if (mapProblematicPackageImports) {
      problematicPackageImportsMapping({
        projectAbsolutePath,
        localPackageFolders,
        localPackageIdentifier,
        problematicPackagesPaths,
      });
    } else {
      setTerminalTextColors({ textColor: TerminalTextColors.Red });

      problematicPackagesPaths.forEach((problematicPath) => {
        const { packageName } = getCurrentCircularDependencyPackageName({ problematicPath });
        const fullPath = problematicPackagesPaths.find((path) => path.startsWith(packageName));
        console.error(`Circular dependency was found in ${packageName}`);
        console.error(`Full path: ${fullPath}`);
      });

      resetTerminalAttributes();
    }
  } catch (error) {
    console.error(error);
  }
};

type ProblematicPackageImportsMappingArgs = {
  projectAbsolutePath: string;
  localPackageFolders: string[];
  localPackageIdentifier: string;
  problematicPackagesPaths: string[];
};

const problematicPackageImportsMapping = ({
  projectAbsolutePath,
  localPackageFolders,
  localPackageIdentifier,
  problematicPackagesPaths,
}: ProblematicPackageImportsMappingArgs) => {
  problematicPackagesPaths.forEach((problematicPath) => {
    const { packageName: dependencyToLookFor, splitProblematicPath } =
      getCurrentCircularDependencyPackageName({ problematicPath });
    const packageToLookThrough = splitProblematicPath[splitProblematicPath.length - 2]
      .trim()
      .replace(`${localPackageIdentifier}/`, "");
    const absolutePaths = localPackageFolders.map((folder) => {
      return `${projectAbsolutePath}/${folder}/${packageToLookThrough}/package.json`;
    });

    const existingPath = absolutePaths.find((absolutePath) => {
      return existsSync(absolutePath);
    });

    if (!existingPath) {
      return;
    }

    const endIndex = existingPath.length - "/package.json".length;
    const usedFiles: string[] = [];
    recursiveFileImports({
      packageName: dependencyToLookFor,
      fullPath: existingPath.slice(0, endIndex),
      usedFiles,
    });
    setTerminalTextColors({ textColor: TerminalTextColors.Red });
    const fullPath = problematicPackagesPaths.find((path) => path.startsWith(dependencyToLookFor));
    console.error(`Circular dependency was found in ${dependencyToLookFor}`);
    console.error(`Full path: ${fullPath}`);
    resetTerminalAttributes();
    console.error("Problematic dependency encountered at:");
    if (usedFiles.length > 0) {
      usedFiles.forEach((usedFile) => {
        console.log(usedFile);
      });
    } else {
      console.log("No files were found with the problematic dependency.");
    }
  });
};

type RecursiveFileImportsArgs = {
  packageName: string;
  fullPath: string;
  usedFiles: string[];
};

const recursiveFileImports = ({ packageName, fullPath, usedFiles }: RecursiveFileImportsArgs) => {
  try {
    const files = readdirSync(fullPath, { withFileTypes: true });
    for (const file of files) {
      const isDirectory = file.isDirectory();
      const fullFilePath = `${fullPath}/${file.name}`;

      if (isDirectory) {
        recursiveFileImports({ packageName, fullPath: fullFilePath, usedFiles });
      } else {
        const file = readFileSync(fullFilePath, { encoding: "utf-8" });
        const splitFile = file.split("\n");
        splitFile.forEach((row, index) => {
          const columnIndex = row.indexOf(packageName);
          if (columnIndex === -1) {
            return;
          }

          usedFiles.push(`${fullFilePath}:${index + 1}:${columnIndex}`);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
