import { ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "parse-yaml-tests",
  name: "parse-yaml tests",
  on: {
    pull_request: {
      branches: ["main"],
      types: ["opened", "synchronize", "reopened"],
    },
  },
  jobs: {
    "Parse-Yaml-tests": {
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
          run: "node ./ci-scripts/removePostInstall.js cs",
        },
        {
          name: "Install dependencies",
          run: "npm i",
        },
        {
          name: "Run tests",
          run: "cd packages/parse-yaml && npm run test",
        },
      ],
    },
  },
} satisfies ActionYamlConfigProps;
