import { type ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "dynatic-css-utils-tests",
  name: "Dynatic CSS Utils tests",
  on: {
    pull_request: {
      branches: ["main"],
      types: ["opened", "synchronize", "reopened"],
    },
  },
  jobs: {
    "Dynatic-CSS-Utils-tests": {
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
          run: "cd packages/dynatic-css-utils && npm run test",
        },
      ],
    },
  },
} satisfies ActionYamlConfigProps;
