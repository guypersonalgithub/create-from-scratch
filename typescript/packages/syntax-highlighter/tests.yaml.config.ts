import { ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "syntax-highlighter-tests",
  name: "Syntax-Highlighter tests",
  on: {
    pull_request: {
      branches: ["main"],
      types: ["opened", "synchronize", "reopened"],
    },
  },
  jobs: {
    "Syntax-Highlighter-tests": {
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
          run: "cd packages/syntax-highlighter && npm run test",
        },
      ],
    },
  },
} satisfies ActionYamlConfigProps;
