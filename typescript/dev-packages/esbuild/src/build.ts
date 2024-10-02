import { build, BuildOptions } from "esbuild";

export const buildContent = async ({ entryPoints = ["./src/index.ts"], ...rest }: BuildOptions) => {
  try {
    await build({
      entryPoints,
      bundle: true,
      platform: "node",
      format: "cjs",
      outfile: "dist/index.cjs",
      tsconfig: "./tsconfig.json",
      external: ["tslib"], // Exclude tslib from bundling
      loader: {
        ".png": "file",
        ".webp": "file",
      },
      ...rest,
    });

    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};
