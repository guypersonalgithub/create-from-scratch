type ReplaceTokenAppearancesInStringArgs = {
  str: string;
  token: string;
};

export const replaceTokenAppearancesInString = ({
  str,
  token,
}: ReplaceTokenAppearancesInStringArgs) => {
  const regex = new RegExp(token, "g");
  return str.replace(regex, "");
};
