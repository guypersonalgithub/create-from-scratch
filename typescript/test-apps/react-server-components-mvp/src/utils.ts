import { buildContent } from "@packages/esbuild";
import { fileURLToPath } from "url";

export const build = async () => {
  await buildContent({
    bundle: true,
    format: "esm",
    logLevel: "error",
    entryPoints: [resolveApp({ path: "Page.tsx" })],
    outdir: resolveBuild({ path: "" }),
    packages: "external",
    minify: false,
    sourcemap: false,
  });

  await buildContent({
    bundle: true,
    format: "esm",
    logLevel: "error",
    entryPoints: [resolveApp({ path: "App.client.tsx" })],
    outdir: resolveBuild({ path: "" }),
    splitting: true,
    plugins: [],
    minify: false,
    sourcemap: false,
  });
};

type ResolveAppArgs = {
  path: string;
};

const appDir = new URL("./app/", import.meta.url);
const buildDir = new URL("./build/", import.meta.url);

const resolveApp = ({ path }: ResolveAppArgs) => {
  return fileURLToPath(new URL(path, appDir));
};

type ResolveBuildArgs = {
  path: string;
};

const resolveBuild = ({ path }: ResolveBuildArgs) => {
  return fileURLToPath(new URL(path, buildDir));
};
