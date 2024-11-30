import { Flag } from "./types";

type GetFlagsArgs = {
  singleKeyValue: boolean;
};

export const getFlags = ({ singleKeyValue }: GetFlagsArgs = { singleKeyValue: false }) => {
  const { argv } = process;
  const flags = argv.slice(2);

  if (flags.length === 0) {
    return [];
  }

  const flagsArray = splitToFlagsArray({ flags });

  if (singleKeyValue) {
    return [flagsArray[0]];
  }

  return flagsArray;
};

type SplitToFlagsArrayArgs = {
  flags: string[];
};

const splitToFlagsArray = ({ flags }: SplitToFlagsArrayArgs) => {
  const flagsArray: Flag[] = [];

  for (let i = 0; i < flags.length; i++) {
    const current = flags[i];
    const isFlag = current.slice(0, 2) === "--";

    if (!isFlag && flagsArray.length === 0) {
      console.error(`Skipped a received unexpected value without flag key - ${current}`);
      continue;
    }

    if (isFlag) {
      const [key, value] = current.split("=");
      const onlyFlagValue = key.slice(2);
      flagsArray.push({ key: onlyFlagValue, value: value ? [value] : [] });
      continue;
    }

    flagsArray[flagsArray.length - 1].value.push(current);
  }

  return flagsArray;
};
