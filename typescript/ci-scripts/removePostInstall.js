import fs from "fs";

// This file exists to remove the postinstall script of the root package.json, as we don't want the postinstall script to run in cloud environments.
const removePostinstall = () => {
  const { argv } = process;
  const flags = argv.slice(2);

  const workspace = flags[0];

  const packageJson = fs.readFileSync("./package.json", { encoding: "utf-8" });
  const parsed = JSON.parse(packageJson);
  const { scripts } = parsed;
  delete scripts.postinstall;
  if (workspace) {
    scripts.build = `npm run build --workspace=${workspace}`;
    scripts["build-ga"] = `npm run build-ga --workspace=${workspace}`;
  }
  parsed.scripts = scripts;
  console.log(parsed);
  console.log("Removed postinstall successfully!");
  fs.writeFileSync("./package.json", JSON.stringify(parsed, null, 2));
};

removePostinstall();
