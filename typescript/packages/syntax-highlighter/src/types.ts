import { TypescriptTokenTypeOptions } from "@packages/parse-typescript";
import { YAMLTokenTypeOptions } from "@packages/parse-yaml";
import { SupportedLanguages } from "./languages";

export type GenericBaseToken<T extends SupportedLanguages> = {
  type: TokenMaps[T];
  value: string;
};

export type TokenMaps = {
  typescript: TypescriptTokenTypeOptions;
  yaml: YAMLTokenTypeOptions;
};
