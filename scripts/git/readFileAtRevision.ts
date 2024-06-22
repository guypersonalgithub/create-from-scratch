import { executeTerminalCommandWithResponse } from "../terminal";

type ReadFileAtRevisionArgs = {
  filePath: string;
  revision: string;
};

export const readFileAtRevision = async ({ filePath, revision }: ReadFileAtRevisionArgs) => {
  const content = await executeTerminalCommandWithResponse({
    command: `git show ${revision}:${filePath}`,
  });

  if (!content) {
    return;
  }

  return JSON.parse(content);
};
