import { JSX } from "react";
import { SupportedLanguages } from "./languages";
import { GenericBaseToken, TokenMaps } from "./types";
import { countLines } from "@packages/utils";

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
    const linesCount = countLines({ str: code });
    const maximumLinesLength = linesCount.toString().length;

    const getCurrentLineCounterElement = ({ lineCounter }: GetCurrentLineCounterElementArgs) => {
      const currentLength = lineCounter.toString().length;

      let formattedLineCounter = "";

      for (let i = currentLength; i < maximumLinesLength; i++) {
        formattedLineCounter += " ";
      }

      formattedLineCounter += lineCounter + "  ";

      return <span>{formattedLineCounter}</span>;
    };

    const output: JSX.Element[] = [];
    let lineCounter = 1;
    output.push(getCurrentLineCounterElement({ lineCounter }));

    tokens.forEach((current, index) => {
      const { type, value } = current;
      const split = value.split(/\r\n|\r|\n/);
      const color = customCellColors[index] ?? baseColors[cellTypeRebranding[index] ?? type];

      split.forEach((part, index) => {
        if (index > 0) {
          lineCounter++;
          output.push(<span style={{ color }}>{"\n"}</span>);
          output.push(getCurrentLineCounterElement({ lineCounter }));
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
