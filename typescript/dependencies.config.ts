import type { ConfigProperties } from "@packages/detect-repository-dependencies";

export default {
  includeFilesPatterns: ["**/*.container.json"],
  packageIdentifiers: ["@packages"],
} satisfies ConfigProperties;
