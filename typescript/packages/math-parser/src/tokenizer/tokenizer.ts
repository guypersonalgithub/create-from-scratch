import { BaseToken } from "./types";
import { uniqueTokens } from "./uniqueTokens";

type TokenizerArgs = {
  input: string;
};

type TokenContext = {
  isNumber?: {
    hasDot: boolean;
  };
};

export const tokenizer = ({ input }: TokenizerArgs) => {
  const tokens: BaseToken[] = [];
  let currentToken = "";
  let previousToken: BaseToken | undefined = undefined;
  let tokenContext: TokenContext = {};

  try {
    for (let i = 0; i < input.length; i++) {
      const currentChar = input[i];
      if (currentChar === " ") {
        if (currentToken.length === 0) {
          continue;
        }

        const token = {
          type: "value",
          value: currentToken,
        };

        currentToken = "";
        tokenContext = {};
        tokens.push(token);
        previousToken = token;

        continue;
      }
      const uniqueToken = uniqueTokenFlow({ currentChar, tokens, currentToken, previousToken });
      if (uniqueToken) {
        currentToken = "";
        tokenContext = {};
        previousToken = uniqueToken;

        continue;
      }

      if (currentChar === "." && currentChar.length === 0) {
        currentToken = "0.";
        tokenContext.isNumber = {
          hasDot: true,
        };

        const followingChar = input[i + 1];
        const isFollowingCharNumber = !isNaN(Number.parseFloat(followingChar));
        if (!isFollowingCharNumber) {
          throw new Error("Unexpected syntax");
        }
      } else {
        const isNumber = !isNaN(Number.parseFloat(currentChar));
        if (isNumber) {
          currentToken += currentChar;
        } else if (currentChar === ".") {
          if (tokenContext.isNumber?.hasDot) {
            throw new Error("Unexpected syntax");
          }

          currentToken += currentChar;
          tokenContext.isNumber = {
            hasDot: true,
          };

          const followingChar = input[i + 1];
          const isFollowingCharNumber = !isNaN(Number.parseFloat(followingChar));
          if (!isFollowingCharNumber) {
            throw new Error("Unexpected syntax");
          }
        } else {
          throw new Error(
            `Current received character ${currentChar} is not supported by the tokenizer.`,
          );
        }
      }
    }

    if (uniqueTokens.has(currentToken)) {
      throw new Error(`Received unexpected syntax. Input ended on an operator ${currentToken}.`);
    } else {
      if (previousToken?.value === ")") {
        const operatorToken = {
          type: "uniqueToken",
          value: "*",
        };

        tokens.push(operatorToken);
      }

      const token = {
        type: "value",
        value: currentToken,
      };

      tokens.push(token);
    }

    return tokens;
  } catch (error) {
    console.error("Received unexpected syntax.");
    return [];
  }
};

type UniqueTokenFlowArgs = {
  currentChar: string;
  tokens: BaseToken[];
  currentToken: string;
  previousToken?: BaseToken;
};

const uniqueTokenFlow = ({
  currentChar,
  tokens,
  currentToken,
  previousToken,
}: UniqueTokenFlowArgs) => {
  const isUniqueToken = uniqueTokens.has(currentChar);

  if (!isUniqueToken) {
    return;
  }

  if (isUniqueToken && currentToken.length > 0) {
    const token = {
      type: "value",
      value: currentToken,
    };

    currentToken = "";
    tokens.push(token);
    previousToken = token;
  }

  if (!previousToken && !["(", "-"].includes(currentChar)) {
    throw new Error("Unexpected syntax");
  }

  if (previousToken) {
    if (
      (previousToken.value === "(" && currentChar === ")") ||
      (["*", "/", "^"].includes(previousToken.value) && !["(", "-"].includes(currentChar))
    ) {
      throw new Error("Unexpected syntax");
    }

    if (currentChar === "-" && uniqueTokens.has(previousToken.value)) {
      if (previousToken.value === "-") {
        tokens.pop();

        const operatorToken = {
          type: "uniqueToken",
          value: "+",
        };

        tokens.push(operatorToken);

        return operatorToken;
      } else if (previousToken.value === "+") {
        tokens.pop();

        const operatorToken = {
          type: "uniqueToken",
          value: "-",
        };

        tokens.push(operatorToken);

        return operatorToken;
      }

      const valueToken = {
        type: "value",
        value: "-1",
      };

      tokens.push(valueToken);

      const operatorToken = {
        type: "uniqueToken",
        value: "*",
      };

      tokens.push(operatorToken);

      return operatorToken;
    }

    if (previousToken.type === "value" && currentChar === "(") {
      const operatorToken = {
        type: "uniqueToken",
        value: "*",
      };

      tokens.push(operatorToken);
    }
  }

  const token = {
    type: "uniqueToken",
    value: currentChar,
  };

  tokens.push(token);

  return token;
};
