import { buildContent } from "@packages/esbuild";
import { getProjectAbsolutePath } from "@packages/paths";

type BuildExtensionArgs = {
  extensionName: string;
  externalPackages?: string[];
};

export const buildExtension = async ({
  extensionName,
  externalPackages = [],
}: BuildExtensionArgs) => {
  const absolutePath = getProjectAbsolutePath();
  const fullPath = `${absolutePath}/vscode-extensions/${extensionName}`;

  await buildContent({
    entryPoints: [`${fullPath}/src/extension.ts`],
    outfile: `${fullPath}/dist/extension.js`,
    bundle: true, // bundle workspace imports
    platform: "node",
    format: "cjs", // VS Code requires CJS
    sourcemap: true,
    external: externalPackages,
    target: ["node18"], // match VS Code extension host
    logLevel: "info",

    // Optional: resolve TS + ESM paths in workspaces
    loader: { ".ts": "ts" },
    mainFields: ["module", "main"],

    // Define path aliases if needed
    // e.g., "@packages/parse-css": "../packages/parse-css/src/index.ts"
  });
};
