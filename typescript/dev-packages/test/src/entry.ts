import { loadTestsFromDir } from "./loadTestsFromDir";
import { run } from "./runner";
import { resolve } from "path";

const main = async () => {
  const testsDir = resolve(process.cwd(), "tests");
  await loadTestsFromDir({ dir: testsDir });
  await run();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
