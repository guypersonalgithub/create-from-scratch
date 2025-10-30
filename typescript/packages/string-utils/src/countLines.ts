type CountLineArgs = {
  str: string;
  returnSplitStr?: boolean;
};

export function countLines(args: CountLineArgs & { returnSplitStr: boolean }): {
  linesCount: number;
  splitStr: string[];
};
export function countLines(args: CountLineArgs): { linesCount: number };

export function countLines({ str, returnSplitStr }: CountLineArgs) {
  if (str === "") {
    return { linesCount: 0 };
  }

  const splitStr = str.split(/\r\n|\r|\n/);

  if (returnSplitStr) {
    return {
      linesCount: splitStr.length,
      splitStr,
    };
  }

  return {
    linesCount: splitStr.length,
  };
}
