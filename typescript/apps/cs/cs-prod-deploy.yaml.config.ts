import { type ActionYamlConfigProps } from "@packages/github-actions";

export default {
  fileName: "cs-prod-deploy",
  name: "CS Netlify Production Deployment",
  env: {
    NETLIFY_AUTH_TOKEN: "${{ secrets.CS_NETLIFY_TOKEN }}",
    NETLIFY_SITE_ID: "${{ secrets.CS_NETLIFY_SITE_ID }}",
  },
  on: {
    push: {
      branches: ["main"],
    },
  },
  jobs: {
    "Deploy-Production": {
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
          name: "Install Netlify CLI",
          run: "npm i -g netlify-cli",
        },
        {
          name: "Install tsx",
          run: "npm i -g tsx@^4.7.2 --save-dev",
        },
        {
          name: "Create _redirects file",
          run: "node ./ci-scripts/createCSRRedirects.js cs",
        },
        { name: "Create working folder", run: "mkdir full-application" },
        {
          name: "Remove postinstall",
          run: "node ./ci-scripts/removePostInstall.js cs",
        },
        {
          name: "Copy root package.json",
          run: "cp -r package.json ./full-application/",
        },
        {
          name: "Copy workspace",
          run: ["mkdir -p ./full-application/apps", "cp -r ./apps/cs ./full-application/apps"],
        },
        {
          name: "Copy dependencies",
          run: ["mkdir -p ./full-application/packages"],
        },
        {
          name: "Install dependencies",
          run: "npm ci",
        },
        {
          name: "Build application",
          run: "npm run build",
        },
        {
          name: "Deploy",
          run: "netlify deploy --prod --dir=./apps/cs/dist",
        },
      ],
    },
  },
  dependencies: { step: "Copy dependencies" },
} satisfies ActionYamlConfigProps;
