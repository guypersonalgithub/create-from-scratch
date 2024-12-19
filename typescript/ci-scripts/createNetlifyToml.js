import { writeFileSync } from "fs";

const createNetlifyToml = () => {
  const { argv } = process;
  const flags = argv.slice(2);

  const workspace = flags[0];

  if (!workspace) {
    throw "Missing workspace to proceed!";
  }

  const file = `[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

  const root = process.cwd();
  const workspacePath = `${root}/apps/${workspace}/dist`;
  const newFilePath = `${workspacePath}/netlify.toml`;
  writeFileSync(newFilePath, file);
};

createNetlifyToml();
