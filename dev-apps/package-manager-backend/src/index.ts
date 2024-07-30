import express from "express";
import cors from "cors";
// import { loadFlagsIntoEnv } from "@packages/utils";
import { detectAllRepositoryDependencies } from "@packages/detect-repository-dependencies";

// loadFlagsIntoEnv();

const app = express();

let cachedDependencies: ReturnType<typeof detectAllRepositoryDependencies> | undefined;

const corsOptions = {
  origin: [`http://localhost:${process.env.FRONT_PORT}`],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {});

app.get("/detectDependencies", (req, res) => {
  const { invalidateCache } = req.headers;

  if (!cachedDependencies || invalidateCache) {
    cachedDependencies = detectAllRepositoryDependencies();
  }

  res.send({ data: cachedDependencies });
});

app.listen(process.env.PORT ?? 3000, async () => {
  console.log(`Listening on port ${process.env.PORT ?? 3000}`);
});
