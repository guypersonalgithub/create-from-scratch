import { statSync } from "fs";

type LastTimeFilesWereChangedArgs = {
  filePaths: string[];
};

export const lastTimeFilesWereChanged = ({
  filePaths,
}: LastTimeFilesWereChangedArgs) => {
  try {
    const fileStats: Record<string, string> = {};
    filePaths.forEach((filePath) => {
      const stats = lastTimeFileWasChanged({ filePath });
      if (!stats) {
        return;
      }

      fileStats[filePath] = stats;
    });

    return fileStats;
  } catch (error) {
    return;
  }
};

type LastTimeFileWasChangedArgs = {
  filePath: string;
};

export const lastTimeFileWasChanged = ({ filePath }: LastTimeFileWasChangedArgs) => {
  try {
    const stats = statSync(filePath);
    return stats.mtime.toISOString();
  } catch (error) {
    return;
  }
};
