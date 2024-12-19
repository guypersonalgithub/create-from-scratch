import { writeFileSync } from "fs";

const createCSRRedirects = () => {
  const { argv } = process;
  const flags = argv.slice(2);

  const workspace = flags[0];

  if (!workspace) {
    throw "Missing workspace to proceed!";
  }

  const file = `/* /index.html 200`;

  const root = process.cwd();
  const workspacePath = `${root}/apps/${workspace}/public`;
  const newFilePath = `${workspacePath}/_redirects`;
  writeFileSync(newFilePath, file);
};

createCSRRedirects();
