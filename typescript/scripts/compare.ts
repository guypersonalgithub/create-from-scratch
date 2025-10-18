import { readFileSync, writeFileSync } from "fs";

const og = readFileSync("./testingold.ts", "utf-8");
const newList = readFileSync("./testingnew.ts", "utf-8");

const ogPaths = JSON.parse(og).paths as string[];
const newListPaths = JSON.parse(newList).paths as string[];

const ogPathsSet = new Set(ogPaths);

newListPaths.forEach((path) => {
  ogPathsSet.delete(path);
});

writeFileSync(
  "./completelyNew.ts",
  JSON.stringify({ paths: [...ogPathsSet].map((path) => path.replace("\\", "/")) }, null, 2),
);
