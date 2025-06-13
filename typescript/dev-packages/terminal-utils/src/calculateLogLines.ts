import { countTokenAppearancesInString, replaceTokenAppearancesInString } from "@packages/utils";

type CalculateLogLinesArgs = {
  text: string;
};

export const calculateLogLines = ({ text }: CalculateLogLinesArgs) => {
  const amountOfLineBreaks = countTokenAppearancesInString({
    str: text,
    token: "\n",
  });
  const textWithoutLineBreaks =
    amountOfLineBreaks > 0 ? replaceTokenAppearancesInString({ str: text, token: "\n" }) : text;

  const terminalWidth = process.stdout.columns || 80; // Default width of 80 characters
  const textLines = Math.ceil(textWithoutLineBreaks.length / terminalWidth);

  return amountOfLineBreaks + textLines;
};
