import { readFileSync } from "fs";
import { roughEstimateLLMTokenCount } from "./roughEstimateLLMTokenCount";

type CountRoughEstimateTokenCountInFilesArgs = {
  files: string[];
};

export const countRoughEstimateTokenCountInFiles = ({
  files,
}: CountRoughEstimateTokenCountInFilesArgs) => {
  let totalEstimatedTokens = 0;

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8");
      totalEstimatedTokens += roughEstimateLLMTokenCount({ text: content });
    } catch (error) {
      console.log(`Failed to load file ${file}`);
    }
  }

  return totalEstimatedTokens;
};
