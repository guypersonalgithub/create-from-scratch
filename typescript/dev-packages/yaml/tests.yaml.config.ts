import { type ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "yaml-tests",
  name: "YAML tests",
  on: {
    pull_request: {
      branches: ["main"],
      types: ["opened", "synchronize", "reopened"],
    },
  },
  jobs: {
    "YAML-tests": {
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
          run: "cd dev-packages/yaml && npm run test",
        },
      ],
    },
  },
} satisfies ActionYamlConfigProps;
