import { writeFileSync } from "fs";
import { capitalizeFirstChar } from "@packages/utils";

type CreateTypecheckGithubActionsConfigArgs = {
  folderName: string;
  folderPath: string;
  folder: string;
};

export const createTypecheckGithubActionsConfig = ({
  folderName,
  folderPath,
  folder,
}: CreateTypecheckGithubActionsConfigArgs) => {
  const formattedFileName = folderName
    .split("-")
    .map((word) => capitalizeFirstChar({ str: word }))
    .join(" ");
  const name = `"${formattedFileName} Typecheck"`;
  const fullPath = `${folderPath}/${folderName}`;

  const fileContent = `import { type ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "${folderName}-typecheck",
  name: ${name},
  on: {
    pull_request: {
      branches: ["main"],
      types: ["opened", "synchronize", "reopened"],
    },
  },
  jobs: {
    Typecheck: {
      "runs-on": "ubuntu-latest",
      defaults: {
        run: {
          "working-directory": "./typescript",
        },
      },
      steps: [
        {
          uses: "actions/checkout@v4",
        },
        {
          name: "Remove postinstall",
          run: "node ./ci-scripts/removePostInstall.js",
        },
        {
          name: "Install dependencies",
          run: "npm i",
        },
        {
          name: "Run typecheck",
          run: "cd ${folder} && npm run typecheck",
        },
      ],
    },
  },
} satisfies ActionYamlConfigProps;
`;

  writeFileSync(`${fullPath}/typecheck.yaml.config.ts`, fileContent);
};
