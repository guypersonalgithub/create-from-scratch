import { type TypescriptTokenTypeOptions } from "@packages/parse-typescript";
import { type YAMLTokenTypeOptions } from "@packages/parse-yaml";
import { type SupportedLanguages } from "./languages";

export type GenericBaseToken<T extends SupportedLanguages> = {
  type: TokenMaps[T];
  value: string;
};

export type TokenMaps = {
  typescript: TypescriptTokenTypeOptions;
  yaml: YAMLTokenTypeOptions;
};

export type Animated =
  | {
      withCursor?: boolean;
      animatedWriting?: boolean;
      pacing?: number;
    }
  | {
      withCursor?: never;
      animatedWriting?: never;
      pacing?: never;
    };

export type GetHighlightedTokensArgs<T extends SupportedLanguages = "typescript"> = {
  code: string;
  language?: SupportedLanguages;
  customizeColors?: (args: {
    tokens: GenericBaseToken<T>[];
    baseColors: Record<TokenMaps[T], string>;
  }) =>
    | {
        customBaseColors?: Partial<Record<TokenMaps[T], string>>;
        cellTypeRebranding?: Record<number, TokenMaps[T]>;
        customCellColors?: Record<number, string>;
      }
    | never;
  addLineCounter?: boolean | never;
};
