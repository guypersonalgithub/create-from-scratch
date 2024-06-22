import { statSync } from "fs";

type WhenWasFileLastChangedArgs = {
  path: string;
};

export const whenWasFileLastChanged = ({ path }: WhenWasFileLastChangedArgs) => {
  const stats = statSync(path);
  return stats.mtime;
};
