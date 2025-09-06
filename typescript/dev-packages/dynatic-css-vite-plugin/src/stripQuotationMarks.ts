type StripQuotationMarksArgs = {
  str: string;
};

export const stripQuotationMarks = ({ str }: StripQuotationMarksArgs) => {
  if (
    (str[0] === "'" && str[str.length - 1] === "'") ||
    (str[0] === '"' && str[str.length - 1] === '"')
  ) {
    return str.slice(1, str.length - 1);
  }

  return str;
};
