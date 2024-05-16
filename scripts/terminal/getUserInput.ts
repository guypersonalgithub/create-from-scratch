import readline from "readline";

type GetUserInputArgs = {
  message: string;
};

export const getUserInput = ({
  message,
}: GetUserInputArgs): Promise<string> => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${message} `, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};
