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
      const { token: uniqueToken, index } = uniqueTokenFlow({
        input,
        i,
        currentChar,
        tokens,
        currentToken,
        previousToken,
      });
      if (index !== undefined) {
        i = index;
      }
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
          const isLetter = isCharacterLetter({ currentChar });

          if (!isLetter) {
            throw new Error(
              `Current received character ${currentChar} is not supported by the tokenizer.`,
            );
          }

          if (currentToken.length > 0) {
            const token = {
              type: "value",
              value: currentToken,
            };

            tokens.push(token);
          }

          let tokenValue = "";
          let tokenType = "";

          switch (currentChar) {
            case "c": {
              if (input[i + 1] === "o" && input[i + 2] === "s") {
                tokenValue = "cos";
                tokenType = "keyword";
                i += 2;
              }
              break;
            }
            case "s": {
              if (input[i + 1] === "i" && input[i + 2] === "n") {
                tokenValue = "sin";
                tokenType = "keyword";
                i += 2;
              } else if (input[i + 1] === "q" && input[i + 2] === "r" && input[i + 3] === "t") {
                tokenValue = "sqrt";
                tokenType = "keyword";
                i += 3;
              }
              break;
            }
            case "t": {
              if (input[i + 1] === "a" && input[i + 2] === "n") {
                tokenValue = "tan";
                tokenType = "keyword";
                i += 2;
              }
              break;
            }
            case "l": {
              if (input[i + 1] === "n") {
                tokenValue = "ln";
                tokenType = "keyword";
                i += 1;
              } else if (input[i + 1] === "o" && input[i + 2] === "g") {
                tokenValue = "log";
                tokenType = "keyword";
                i += 2;
              }
              break;
            }
          }

          const isVariable = tokenType.length === 0;

          const token = {
            type: isVariable ? "variable" : tokenType,
            value: isVariable ? currentChar : tokenValue,
          };

          const lastToken = tokens[tokens.length - 1];
          if (lastToken?.type === "value" || lastToken?.type === "variable") {
            tokens.push({
              type: "uniqueToken",
              value: "*",
            });
          }

          currentToken = "";
          tokenContext = {};
          tokens.push(token);
          previousToken = token;

          if (isVariable) {
            const nextIndex = getNextNonSpaceCharIndex({ input, i });
            if (nextIndex === undefined) {
              break;
            }
            i = nextIndex;

            const followingChar = input[i + 1];
            const isLetter = isCharacterLetter({ currentChar: followingChar });
            const isNumber = !isNaN(Number.parseFloat(followingChar));

            if (isLetter || isNumber) {
              tokens.push({
                type: "uniqueToken",
                value: "*",
              });
            }
          }
        }
      }
    }

    if (uniqueTokens.has(currentToken)) {
      throw new Error(`Received unexpected syntax. Input ended on an operator ${currentToken}.`);
    } else {
      if (currentToken.length > 0) {
        const token = {
          type: "value",
          value: currentToken,
        };

        tokens.push(token);
      }
    }

    return tokens;
  } catch (error) {
    console.error("Received unexpected syntax.", error);
    return [];
  }
};

type UniqueTokenFlowArgs = {
  input: string;
  i: number;
  currentChar: string;
  tokens: BaseToken[];
  currentToken: string;
  previousToken?: BaseToken;
};

const uniqueTokenFlow = ({
  input,
  i,
  currentChar,
  tokens,
  currentToken,
  previousToken,
}: UniqueTokenFlowArgs) => {
  const isUniqueToken = uniqueTokens.has(currentChar);

  if (!isUniqueToken) {
    return {};
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

        return { token: operatorToken, index: i };
      } else if (previousToken.value === "+") {
        tokens.pop();

        const operatorToken = {
          type: "uniqueToken",
          value: "-",
        };

        tokens.push(operatorToken);

        return { token: operatorToken, index: i };
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

      return { token: operatorToken, index: i };
    }

    if ((previousToken.type === "value" || previousToken.type === "variable") && currentChar === "(") {
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

  if (currentChar === ")") {
    const nextIndex = getNextNonSpaceCharIndex({ input, i });
    if (nextIndex !== undefined) {
      const followingChar = input[nextIndex + 1];
      const isLetter = isCharacterLetter({ currentChar: followingChar });
      const isNumber = !isNaN(Number.parseFloat(followingChar));

      if (isLetter || isNumber) {
        tokens.push({
          type: "uniqueToken",
          value: "*",
        });
      }

      i = nextIndex;
    }
  }

  return { token, index: i };
};

type IsCharacterLetterArgs = {
  currentChar: string;
};

const isCharacterLetter = ({ currentChar }: IsCharacterLetterArgs) => {
  if (!currentChar) {
    return false;
  }

  const characterCode = currentChar.charCodeAt(0);
  return (characterCode > 64 && characterCode < 91) || (characterCode > 96 && characterCode < 123);
};

type GetNextNonSpaceCharIndexArgs = {
  input: string;
  i: number;
};

const getNextNonSpaceCharIndex = ({ input, i }: GetNextNonSpaceCharIndexArgs) => {
  while (i < input.length && input[i + 1] === " ") {
    i++;
  }
  if (i === input.length) {
    return;
  }

  return i;
};
