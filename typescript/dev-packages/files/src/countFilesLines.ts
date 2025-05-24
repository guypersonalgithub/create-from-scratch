import { readFileSync } from "fs";

type CountFilesLinesArgs = {
  files: string[];
};

export const countFilesLines = ({ files }: CountFilesLinesArgs) => {
  let totalLines = 0;

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8");
      totalLines += content.split("\n").length;
    } catch (error) {
      console.log(`Failed to load file ${file}`);
    }
  }

  return totalLines;
};
