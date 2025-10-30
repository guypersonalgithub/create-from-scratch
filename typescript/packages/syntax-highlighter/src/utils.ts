import { countLines } from "@packages/string-utils";

type GetCurrentLineCounterElementArgs = {
  lineCounter: number;
  maximumLinesLength: number;
};

export const getCurrentLineCounterElement = ({
  lineCounter,
  maximumLinesLength,
}: GetCurrentLineCounterElementArgs) => {
  const currentLength = lineCounter.toString().length;

  let formattedLineCounter = "";

  for (let i = currentLength; i < maximumLinesLength; i++) {
    formattedLineCounter += " ";
  }

  formattedLineCounter += lineCounter + "  ";

  return formattedLineCounter;
};

type DisplayColorlessCodeArgs = {
  code: string;
  addLineCounter: boolean;
};

export const displayColorlessCode = ({ code, addLineCounter }: DisplayColorlessCodeArgs) => {
  if (!addLineCounter) {
    return code;
  }

  const { linesCount, splitStr = [] } = countLines({ str: code, returnSplitStr: true });
  const maximumLinesLength = linesCount.toString().length;
  const splitStrLength = splitStr.length;

  return splitStr.map((line, index) => {
    const prefix = getCurrentLineCounterElement({ lineCounter: index + 1, maximumLinesLength });
    const addLinebreak = index !== splitStrLength - 1;

    return `${prefix}${line}${addLinebreak ? "\n" : ""}`;
  });
};
