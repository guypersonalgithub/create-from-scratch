type StringFormats = "kebab" | "camel";

type ConvertStringFormatArgs = {
  str: string;
  formatFrom: StringFormats;
  formatTo: StringFormats;
};

export const convertStringFormat = ({ str, formatFrom, formatTo }: ConvertStringFormatArgs) => {
  if (formatFrom === "kebab" && formatTo === "camel") {
    return convertKebabIntoCamel({ str });
  }

  console.error(`Formatting from ${formatFrom} to ${formatTo} is currently not supported.`);

  return "";
};

const convertKebabIntoCamel = ({ str }: Pick<ConvertStringFormatArgs, "str">) => {
  let formattedString: string = "";

  const lowercaseStr = str.toLowerCase();

  for (let i = 0; i < lowercaseStr.length; i++) {
    const currentChar = lowercaseStr[i];
    if (currentChar !== "-") {
      formattedString += currentChar;
    } else {
      const nextChar = lowercaseStr[i + 1];
      if (nextChar && nextChar !== "-") {
        formattedString += nextChar;
        i++;
      }
    }
  }

  return formattedString;
};
