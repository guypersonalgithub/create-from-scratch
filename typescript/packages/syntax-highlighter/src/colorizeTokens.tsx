import { JSX } from "react";
import { SupportedLanguages } from "./languages";
import { GenericBaseToken, TokenMaps } from "./types";
import { countLines } from "@packages/utils";
import { getCurrentLineCounterElement } from "./utils";

type ColorizeTokensArgs<T extends SupportedLanguages> = {
  code: string;
  tokens: GenericBaseToken<T>[];
  baseColors: Record<TokenMaps[T], string>;
  cellTypeRebranding?: Record<number, TokenMaps[T]>;
  customCellColors?: Record<number, string>;
  addLineCounter?: boolean;
};

type GetCurrentLineCounterElementArgs = {
  lineCounter: number;
};

export const colorizeTokens = <T extends SupportedLanguages>({
  code,
  tokens,
  baseColors,
  cellTypeRebranding = {},
  customCellColors = {},
  addLineCounter,
}: ColorizeTokensArgs<T>) => {
  if (addLineCounter) {
    const { linesCount } = countLines({ str: code });
    const maximumLinesLength = linesCount.toString().length;

    const getCurrentLineCounterElementWrapper = (
      args: Parameters<typeof getCurrentLineCounterElement>[0],
    ) => {
      return <span>{getCurrentLineCounterElement(args)}</span>;
    };

    const output: JSX.Element[] = [];
    let lineCounter = 1;
    output.push(getCurrentLineCounterElementWrapper({ lineCounter, maximumLinesLength }));

    tokens.forEach((current, index) => {
      const { type, value } = current;
      const split = value.split(/\r\n|\r|\n/);
      const color = customCellColors[index] ?? baseColors[cellTypeRebranding[index] ?? type];

      split.forEach((part, index) => {
        if (index > 0) {
          lineCounter++;
          output.push(<span style={{ color }}>{"\n"}</span>);
          output.push(getCurrentLineCounterElementWrapper({ lineCounter, maximumLinesLength }));
        }

        output.push(<span style={{ color }}>{part}</span>);
      });
    });

    return output;
  }

  return tokens.map((current, index) => {
    const { type, value } = current;
    const color = customCellColors[index] ?? baseColors[cellTypeRebranding[index] ?? type];
    return <span style={{ color }}>{value}</span>;
  });
};
