type IsCharsAndDigitsOnlyArgs = {
  str: string;
};

export const isCharsAndDigitsOnly = ({ str }: IsCharsAndDigitsOnlyArgs) => {
  return /^[a-zA-Z0-9]$/.test(str);
};
