import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { updateGitIgnore } from "@packages/git";

type TerminalLoggingArgs = {
  fileName: string;
  data: string;
};

export const terminalLogging = ({ fileName, data }: TerminalLoggingArgs) => {
  updateGitIgnore({ filesToIgnore: ["logs"] });

  if (!existsSync("./logs")) {
    mkdirSync("./logs");
  }

  let fileData = "";
  const filePath = `./logs/${fileName}.txt`;

  const fileExists = existsSync(filePath);
  if (!fileExists) {
    writeFileSync(filePath, "");
  } else {
    fileData = readFileSync(filePath, "utf-8");
  }

  fileData += fileData.length > 0 ? `\n${data}` : data;
  writeFileSync(filePath, fileData);
};
