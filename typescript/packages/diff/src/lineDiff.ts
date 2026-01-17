import { diff } from "./diff";

type LineDiffArgs = {
  from: string;
  to: string;
};

export const lineDiff = ({ from, to }: LineDiffArgs) => {
  const splitFrom = from.split("\n");
  const splitTo = to.split("\n");

  return diff({ from: splitFrom, to: splitTo });
};
