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
