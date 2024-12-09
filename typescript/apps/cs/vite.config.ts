import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { existsSync, statSync } from "fs";

const root = path.resolve(__dirname, "../..");
const resolvedPathCache = new Map();

let count = 0;

export default defineConfig({
  plugins: [
    react(),
    {
      name: "vite-plugin-dynamic-alias",
      resolveId(source, importer) {
        count++;

        if (!importer) {
          return source;
        }

        if (source.startsWith("~")) {
          const shortenedPath = importer.slice(root.length);
          const packageMatch =
            shortenedPath.startsWith(`/packages`) || shortenedPath.startsWith(`/dev-packages`);
          const packageMatch2 =
            shortenedPath.startsWith("\\packages") || shortenedPath.startsWith("\\dev-packages");

          let resolvedPath;

          if (packageMatch) {
            const packageName = shortenedPath.split("/")[2];
            resolvedPath = path.join(
              path.resolve(__dirname, `../../packages/${packageName}/src`),
              source.slice(1),
            );
          } else if (packageMatch2) {
            const packageName = shortenedPath.split("\\")[2];
            resolvedPath = path.join(
              path.resolve(__dirname, `../../packages/${packageName}/src`),
              source.slice(1),
            );
          } else {
            resolvedPath = path.join(__dirname, "src", source.slice(1)).replaceAll("\\", "/");
          }

          // Check for file extensions directly
          const extensions = [".tsx", ".ts", ".jsx", ".js"];
          for (const ext of extensions) {
            const attemptPath = resolvedPath + ext;
            if (existsSync(attemptPath)) {
              resolvedPathCache.set(resolvedPath, attemptPath);
              return attemptPath;
            }
          }

          if (existsSync(resolvedPath) && statSync(resolvedPath).isDirectory()) {
            for (const ext of extensions) {
              const indexPath = path.join(resolvedPath, `index${ext}`);
              if (existsSync(indexPath)) {
                resolvedPathCache.set(resolvedPath, indexPath);
                return indexPath;
              }
            }
          }

          console.error(
            `Could not resolve ${source} to a valid file or directory in ${resolvedPath}`,
          );
        }

        return source;
      },
    },
  ],
  resolve: {
    alias: {},
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  server: {
    fs: {
      allow: [path.join(__dirname, "src"), path.join(__dirname, "../../packages")],
    },
  },
});
