import { spaceOrNewLineRegex } from "@packages/regex";

type SplitOnSpaceOrNewlineArgs = {
  str: string;
};

export const splitOnSpaceOrNewline = ({ str }: SplitOnSpaceOrNewlineArgs): string[] => {
  // match runs once and returns contiguous runs of characters that are NOT
  // space or newline. Returns null for empty input -> convert to [].
  return str.match(spaceOrNewLineRegex) ?? [];
};
