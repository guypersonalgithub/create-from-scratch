import express from "express";
import cors from "cors";
// import { loadFlagsIntoEnv } from "@packages/utils";
import {
  detectAllRepositoryDependencies,
  getPackageVersions,
  arePackageJsonDependenciesEqual,
  iterateOverPackageJsons,
} from "@packages/detect-repository-dependencies";
import { LatestVersion } from "@packages/detect-repository-dependencies-types";
import { detectFileChanges } from "@packages/detect-file-changes";
import { getFile } from "@packages/files";
import {
  fetchPackageLatestVersions,
  getVersionsOfCurrentPagination,
} from "./getVersionsOfCurrentPagination";
import { alterPackageVersions, DependenciesToChange } from "@packages/alter-package-versions";

// loadFlagsIntoEnv();

const app = express();

app.use(express.json());

let cachedDependencies:
  | ReturnType<typeof detectAllRepositoryDependencies>["dependencies"]
  | undefined;
let latestVersions: Record<number, LatestVersion> = {};

const corsOptions = {
  origin: [`http://localhost:${process.env.FRONT_PORT}`],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {});

app.get("/detectDependencies", async (req, res) => {
  try {
    const { pagination } = req.query;
    const paginationValue = Number(pagination);

    if (!cachedDependencies) {
      const { dependencies } = detectAllRepositoryDependencies({
        skipPackageJsonPaths: true,
      });
      cachedDependencies = dependencies;
    } else {
      const { packageJsonPaths } = detectAllRepositoryDependencies({
        skipPackageJsonPaths: true,
      });

      const packageJsonPathsArray = [...packageJsonPaths];

      const dependenciesWereChanged = detectFileChanges({
        cacheFolderPath: "dependensee",
        cacheFileName: "cache.json",
        filePaths: packageJsonPathsArray,
        compareCacheAndCurrentCallback: (current = {}, previously = "{}") => {
          const parsedCachedChanges = JSON.parse(previously);
          const differentAmountOfPackageJsons =
            Object.keys(current).length !== Object.keys(parsedCachedChanges).length;

          if (differentAmountOfPackageJsons) {
            return true;
          }

          for (const property in current) {
            const currentLastChange = current[property];
            const cachedLastChange = parsedCachedChanges[property];
            if (currentLastChange !== cachedLastChange) {
              const currentFile = getFile({ path: property }) ?? "{}";
              const parsedCurrentFile = JSON.parse(currentFile);
              const cachedFile =
                getFile({ path: `dependensee/files/${encodeURIComponent(property)}` }) ?? "{}";
              const parsedCachedFile = JSON.parse(cachedFile);

              const areEqual = arePackageJsonDependenciesEqual({
                packageJson1: parsedCurrentFile,
                packageJson2: parsedCachedFile,
              });

              if (!areEqual) {
                return true;
              }
            }
          }

          return false;
        },
      });

      if (dependenciesWereChanged) {
        cachedDependencies = iterateOverPackageJsons({ packageJsonPaths: packageJsonPathsArray });
      }
    }

    if (!latestVersions[paginationValue]) {
      const parsed = await getVersionsOfCurrentPagination({
        paginationValue,
        cachedDependencies,
      });

      if (paginationValue && parsed) {
        latestVersions = {};
        latestVersions[paginationValue] = parsed;
      }
    }

    return res.send({ data: cachedDependencies, latestVersions: latestVersions[paginationValue] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error" });
  }
});

app.get("/latest", async (req, res) => {
  try {
    const { packageNames } = req.query;
    if (!(Array.isArray(packageNames) && packageNames.every((item) => typeof item === "string"))) {
      throw new Error("Missing package names!");
    }

    const parsedData = await fetchPackageLatestVersions({ packageNames });

    res.send({ data: parsedData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error" });
  }
});

app.get("/metadata", async (req, res) => {
  try {
    const { packageName } = req.query;
    if (!packageName || typeof packageName !== "string") {
      throw new Error("Incorrect package name!");
    }

    if (!cachedDependencies) {
      const { dependencies } = detectAllRepositoryDependencies({
        skipPackageJsonPaths: true,
      });

      cachedDependencies = dependencies;
    }

    const data = await getPackageVersions({ packageName });
    const { response } = data ?? {};
    res.send({ data: response, cachedDependencies });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error" });
  }
});

app.post("/updateDependencies", async (req, res) => {
  const dependenciesToChange = req.body as DependenciesToChange;

  const failures = alterPackageVersions({ dependenciesToChange });

  const { dependencies } = detectAllRepositoryDependencies({
    skipPackageJsonPaths: true,
  });

  cachedDependencies = dependencies;

  res.status(failures.length > 0 ? 500 : 200).send({ data: cachedDependencies, failures });
});

app.listen(process.env.PORT ?? 3000, async () => {
  console.log(`Listening on port ${process.env.PORT ?? 3000}`);
});
