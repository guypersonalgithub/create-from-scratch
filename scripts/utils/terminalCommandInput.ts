import readline from "node:readline";

const commandInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type RequestUserInputArgs = {
  question?: string;
  responseAction: (response: string) => void;
};

export const requestUserInput = ({
  question = "",
  responseAction,
}: RequestUserInputArgs) => {
  commandInput.question(question, (response) => {
    responseAction(response);
    commandInput.close();
  });
};
