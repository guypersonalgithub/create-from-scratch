type CountTokenAppearancesInStringArgs = {
  str: string;
  token: string;
};

export const countTokenAppearancesInString = ({
  str,
  token,
}: CountTokenAppearancesInStringArgs) => {
  const regex = new RegExp(token, "g");

  return (str.match(regex) || []).length;
};
