import { type ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "parse-typescript-tests",
  name: "parse-typescript tests",
  on: {
    pull_request: {
      branches: ["main"],
      types: ["opened", "synchronize", "reopened"],
    },
  },
  jobs: {
    "Parse-Typescript-tests": {
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
          name: "Run tests",
          run: "cd packages/parse-typescript && npm run test",
        },
      ],
    },
  },
} satisfies ActionYamlConfigProps;
