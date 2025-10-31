type ReplaceSubstringArgs = {
  str: string;
  from: number;
  to: number;
  newStr: string;
};

export const replaceSubstring = ({ str, from, to, newStr }: ReplaceSubstringArgs) => {
  return str.slice(0, from) + newStr + str.slice(to);
};
