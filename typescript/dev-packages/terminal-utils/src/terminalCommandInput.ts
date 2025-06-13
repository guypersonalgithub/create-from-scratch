import readline from "node:readline";

type RequestUserInputArgs = {
  question?: string;
};

export const requestUserInput = ({ question = "" }: RequestUserInputArgs): Promise<string> => {
  const commandInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    commandInput.question(`${question}\r\n`, (response) => {
      commandInput.close();
      resolve(response);
    });
  });
};
