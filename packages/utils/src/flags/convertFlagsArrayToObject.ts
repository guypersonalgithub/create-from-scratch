import { Flag } from "./types";

type ConvertFlagsArrayToObjectArgs = {
  flags: Flag[];
};

export const convertFlagsArrayToObject = ({ flags }: ConvertFlagsArrayToObjectArgs) => {
  const flagsKeyValue: Record<string, string> = {};
  flags.forEach((flag) => {
    const { key, value } = flag;
    flagsKeyValue[key] = value.join(", ");
  });

  return flagsKeyValue;
};
