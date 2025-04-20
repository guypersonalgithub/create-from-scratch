import { parseTypescript } from "@packages/parse-typescript";
import { parseYaml } from "@packages/parse-yaml";
import { typescriptBaseColors } from "./typescriptBaseColors";
import { yamlBaseColors } from "./yamlBaseColors";

export const supportedLanguages = {
  typescript: {
    callback: parseTypescript,
    baseColors: typescriptBaseColors,
  },
  yaml: {
    callback: parseYaml,
    baseColors: yamlBaseColors,
  },
} as const;

export type SupportedLanguages = keyof typeof supportedLanguages;

