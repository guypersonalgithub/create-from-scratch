import { build, BuildOptions } from "esbuild";

export const buildContent = async ({ entryPoints = ["./src/index.ts"], ...rest }: BuildOptions) => {
  const { format = "esm" } = rest;
  const outfile = format === "esm" ? "dist/index.mjs" : "dist/index.cjs";

  try {
    await build({
      entryPoints,
      bundle: true,
      platform: "node",
      format,
      outfile,
      minify: true,
      sourcemap: true,
      tsconfig: "./tsconfig.json",
      external: ["tslib"], // Exclude tslib from bundling
      loader: {
        ".png": "file",
        ".webp": "file",
      },
      alias: {
        // "~": "./src",
      },
      ...rest,
    });

    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};
