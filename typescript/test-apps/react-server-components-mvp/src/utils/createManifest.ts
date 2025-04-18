import { readdirSync, writeFileSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your build directory
const buildDir = path.join(__dirname, "build");

// Recursively find all `.js` files in the build directory
function getJsFiles(dir: string, base = "") {
  const entries = readdirSync(dir);
  let files: { name: string; path: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const relativePath = path.join(base, entry);

    if (statSync(fullPath).isDirectory()) {
      files = files.concat(getJsFiles(fullPath, relativePath));
    } else if (entry.endsWith(".js")) {
      const moduleName = entry.replace(".js", "");
      files.push({ name: moduleName, path: relativePath });
    }
  }

  return files;
}

const jsFiles = getJsFiles(buildDir);

// Create manifest structure
const serverConsumerManifest: {
  moduleMap: Record<string, {}>,
  serverModuleMap: Record<string, {}>,
  moduleLoading: string;
} = {
  moduleMap: {},
  serverModuleMap: {},
  moduleLoading: "eager",
};

for (const file of jsFiles) {
  serverConsumerManifest.moduleMap[file.name] = {
    id: file.name,
    chunks: [file.path],
    name: "default",
    async: true,
  };
}

// Output manifest file
const outputPath = path.join(__dirname, "src", "react-client-manifest.js");

const outputContent =
  "const serverConsumerManifest = " +
  JSON.stringify(serverConsumerManifest, null, 2) +
  ";\n\nexport default serverConsumerManifest;\n";

writeFileSync(outputPath, outputContent);

console.log("Manifest generated at:", outputPath);
