import express from "express";
import cors from "cors";
// import { loadFlagsIntoEnv } from "@packages/utils";
import {
  detectAllRepositoryDependencies,
  getLatestVersion,
  getPackageVersions,
  arePackageJsonDependenciesEqual,
} from "@packages/detect-repository-dependencies";
import { LatestVersion, NPMRegistry } from "@packages/detect-repository-dependencies-types";
import { detectFileChanges } from "@packages/detect-file-changes";
import { getFile } from "@packages/files";

// loadFlagsIntoEnv();

const app = express();

let cachedDependencies:
  | ReturnType<typeof detectAllRepositoryDependencies>["dependencies"]
  | undefined;
let latestVersions: LatestVersion = [];

const corsOptions = {
  origin: [`http://localhost:${process.env.FRONT_PORT}`],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {});

app.get("/detectDependencies", async (req, res) => {
  try {
    if (!cachedDependencies) {
      const { dependencies } = detectAllRepositoryDependencies({
        skipPackageJsonPaths: true,
      });
      cachedDependencies = dependencies;

      const { pagination } = req.query;
      const paginationValue = Number(pagination);
      if (!Number.isNaN(paginationValue)) {
        const startingIndex = (paginationValue - 1) * 10;
        const endingIndex = startingIndex + 10;

        const parsedDependencies = Object.entries(cachedDependencies ?? {}).map(([key, value]) => {
          return {
            name: key,
            isLocal: value.isLocal,
          };
        });

        const packageNames = parsedDependencies
          .slice(startingIndex, endingIndex)
          .filter((row) => !row.isLocal)
          .map((pack) => pack.name);

        const data = await Promise.all(
          packageNames.map((packageName) => {
            return getPackageVersions({ packageName });
          }),
        );

        latestVersions = getLatestVersion({ data: data.filter(Boolean) as NPMRegistry[] });
      }

      return res.send({ data: cachedDependencies, latestVersions });
    } else {
      const { packageJsonPaths } = detectAllRepositoryDependencies({
        skipPackageJsonPaths: true,
      });

      const dependenciesWereChanged = detectFileChanges({
        cacheFolderPath: "dependensee",
        cacheFileName: "cache.json",
        filePaths: [...packageJsonPaths],
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

      console.log({ dependenciesWereChanged });
    }

    return res.send({ data: cachedDependencies, latestVersions });
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

    const data = await Promise.all(
      packageNames.map((packageName) => {
        return getPackageVersions({ packageName });
      }),
    );
    const parsedData = getLatestVersion({ data: data.filter(Boolean) as NPMRegistry[] });

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

    const data = await getPackageVersions({ packageName });
    res.send({ data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error" });
  }
});

app.listen(process.env.PORT ?? 3000, async () => {
  console.log(`Listening on port ${process.env.PORT ?? 3000}`);
});
