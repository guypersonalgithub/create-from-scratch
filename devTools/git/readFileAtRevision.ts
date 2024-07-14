import { executeTerminalCommandWithResponse } from "../terminal";

type ReadFileAtRevisionArgs = {
  filePath: string;
  revision: string;
};

export const readFileAtRevision = async ({ filePath, revision }: ReadFileAtRevisionArgs) => {
  let content: string | undefined;

  try {
    content = await executeTerminalCommandWithResponse({
      command: `git show ${revision}:${filePath}`,
    });
  } catch (error) {}

  if (!content) {
    return {};
  }

  return JSON.parse(content);
};
