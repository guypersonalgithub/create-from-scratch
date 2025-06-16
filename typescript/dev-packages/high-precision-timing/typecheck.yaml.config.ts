import { type ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "high-precision-timing-typecheck",
  name: "High Precision Timing Typecheck",
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
          run: "cd typescript/dev-packages/high-precision-timing && npm run typecheck",
        },
      ],
    },
  },
} satisfies ActionYamlConfigProps;
