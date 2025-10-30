type RemoveQuotationMarksArgs = {
  str: string;
};

export const removeQuotationMarks = ({ str }: RemoveQuotationMarksArgs) => {
  return str.replace(/["'`]/g, "");
};

export const removeWrapperQuotationMarks = ({ str }: RemoveQuotationMarksArgs) => {
  const firstChar = str.charAt(0);
  const lastChar = str.charAt(str.length - 1);
  if (firstChar !== lastChar) {
    return str;
  }

  if (['"', "'", "`"].includes(firstChar)) {
    return str.slice(1, str.length - 1);
  }

  return str;
};
