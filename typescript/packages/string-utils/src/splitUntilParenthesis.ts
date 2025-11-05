type SplitUntilParenthesisArgs = {
  str: string;
};

export const splitUntilParenthesis = ({ str }: SplitUntilParenthesisArgs) => {
  const result: string[] = [];
  let start = 0;

  for (let i = 0; i < str.length; i++) {
    const current = str[i];
    if (current === ".") {
      result.push(str.slice(start, i));
      start = i + 1;
    } else if (current === "(") {
      result.push(str.slice(start, i));
      break;
    }
  }

  return result;
};
