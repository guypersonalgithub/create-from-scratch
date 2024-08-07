import express from "express";
import cors from "cors";
// import { loadFlagsIntoEnv } from "@packages/utils";
import {
  detectAllRepositoryDependencies,
  getLatestVersion,
  getPackageVersions,
} from "@packages/detect-repository-dependencies";
import { LatestVersion, NPMRegistry } from "@packages/detect-repository-dependencies-types";

// loadFlagsIntoEnv();

const app = express();

let cachedDependencies: ReturnType<typeof detectAllRepositoryDependencies> | undefined;

const corsOptions = {
  origin: [`http://localhost:${process.env.FRONT_PORT}`],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {});

app.get("/detectDependencies", async (req, res) => {
  try {
    const { invalidateCache } = req.headers;

    if (!cachedDependencies || invalidateCache) {
      cachedDependencies = detectAllRepositoryDependencies();
    }

    let latestVersions: LatestVersion = [];

    const { pagination } = req.query;
    const paginationValue = Number(pagination);
    if (!Number.isNaN(paginationValue)) {
      const startingIndex = (paginationValue - 1) * 10;
      const endingIndex = startingIndex + 10;

      const parsedDependencies = Object.entries(cachedDependencies).map(([key, value]) => {
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

    res.send({ data: cachedDependencies, latestVersions });
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

app.get("/versions", async (req, res) => {
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
    res.send({ data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error" });
  }
});

app.listen(process.env.PORT ?? 3000, async () => {
  console.log(`Listening on port ${process.env.PORT ?? 3000}`);
});
