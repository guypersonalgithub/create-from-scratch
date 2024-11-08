import { TokenTypes } from "./constants";
import { BaseToken } from "./types";
import { getNextNonSpaceCharIndex, getUniqueToken, isCharacterLetter } from "./utils";
import {
  nonStarterTokens,
  starterTokens,
  uniqueFunctions,
  uniqueTokens,
  uniqueWords,
} from "./uniqueTokens";

type TokenizerArgs = {
  input: string;
};

type TokenContext = {
  isNumberWithDot?: boolean;
  isUniqueFunctionOrLogWithPower?: {
    hasParenthesis?: {
      remainingOpenedParenthesis: string[];
    };
    hasNoParenthesis?: boolean;
  }[];
  isLog?: {
    remainingOpenedParenthesis: string[];
    hasComa: boolean;
  }[];
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
          type: TokenTypes.VALUE,
          value: currentToken,
        };

        currentToken = "";
        delete tokenContext.isNumberWithDot;
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
        tokenContext,
      });

      if (index !== undefined) {
        i = index;
      }

      if (uniqueToken) {
        currentToken = "";
        delete tokenContext.isNumberWithDot;
        previousToken = uniqueToken;

        continue;
      }

      if (currentChar === "." && currentChar.length === 0) {
        currentToken = "0.";
        tokenContext.isNumberWithDot = true;

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
          if (tokenContext.isNumberWithDot) {
            throw new Error("Unexpected syntax");
          }

          currentToken += currentChar;
          tokenContext.isNumberWithDot = true;

          const followingChar = input[i + 1];
          const isFollowingCharNumber = !isNaN(Number.parseFloat(followingChar));
          if (!isFollowingCharNumber) {
            throw new Error("Unexpected syntax");
          }
        } else if (currentChar === ",") {
          const hasLogs = tokenContext.isLog;
          if (!hasLogs || hasLogs[hasLogs.length - 1].hasComa) {
            throw new Error("Unexpected syntax");
          }

          const currentValueToken = {
            type: TokenTypes.VALUE,
            value: currentToken,
          };

          tokens.push(currentValueToken);

          hasLogs[hasLogs.length - 1].hasComa = true;
          const token = {
            type: TokenTypes.LOG_SPREAD,
            value: currentChar,
          };

          currentToken = "";
          delete tokenContext.isNumberWithDot;
          tokens.push(token);
          previousToken = token;
          continue;
        } else {
          const isLetter = isCharacterLetter({ currentChar });

          if (!isLetter) {
            throw new Error(
              `Current received character ${currentChar} is not supported by the tokenizer.`,
            );
          }

          if (currentToken.length > 0) {
            const token = {
              type: TokenTypes.VALUE,
              value: currentToken,
            };

            tokens.push(token);
          }

          let tokenValue = getUniqueToken({ input: input.slice(i) });
          const isVariable = !tokenValue;
          const isNotE = currentChar !== "e";
          const isLog = tokenValue === "log";

          if (isLog) {
            if (!tokenContext.isLog) {
              tokenContext.isLog = [];
            }
            tokenContext.isLog.push({
              remainingOpenedParenthesis: [],
              hasComa: false,
            });
          }

          const token = {
            type: isNotE && isVariable ? TokenTypes.VARIABLE : TokenTypes.KEYWORD,
            value: isVariable ? currentChar : tokenValue,
          } as BaseToken;

          if (tokenValue) {
            i += tokenValue.length - 1;
          }

          const lastToken = tokens[tokens.length - 1];
          if (
            lastToken?.type === TokenTypes.VALUE ||
            lastToken?.type === TokenTypes.VARIABLE ||
            lastToken?.value === "!"
          ) {
            tokens.push({
              type: TokenTypes.UNIQUE_TOKEN,
              value: "*",
            });
          }

          currentToken = "";
          delete tokenContext.isNumberWithDot;
          tokens.push(token);
          previousToken = token;

          if (isVariable || isLog) {
            const nextIndex = getNextNonSpaceCharIndex({ input, i });
            if (nextIndex === undefined) {
              break;
            }
            i = nextIndex;

            const followingChar = input[i + 1];
            if (followingChar === undefined) {
              break;
            }

            if (isLog) {
              if (followingChar !== "(" && followingChar !== "^" && followingChar !== "|") {
                throw new Error("Unexpected syntax");
              }

              continue;
            }

            const isLetter = isCharacterLetter({ currentChar: followingChar });
            const isNumber = !isNaN(Number.parseFloat(followingChar));

            if (isLetter || isNumber) {
              tokens.push({
                type: TokenTypes.UNIQUE_TOKEN,
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
          type: TokenTypes.VALUE,
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
  tokenContext: TokenContext;
};

const uniqueTokenFlow = ({
  input,
  i,
  currentChar,
  tokens,
  currentToken,
  previousToken,
  tokenContext,
}: UniqueTokenFlowArgs) => {
  const isUniqueToken = uniqueTokens.has(currentChar);

  if (!isUniqueToken) {
    return {};
  }

  if (isUniqueToken && currentToken.length > 0) {
    const token = {
      type: TokenTypes.VALUE,
      value: currentToken,
    };

    tokens.push(token);
    previousToken = token;
  }

  if (!previousToken && !starterTokens.includes(currentChar)) {
    throw new Error("Unexpected syntax");
  }

  if (previousToken) {
    if (
      (previousToken.value === "(" && [...nonStarterTokens, ")"].includes(currentChar)) ||
      (previousToken.value === "-" && nonStarterTokens.includes(currentChar)) ||
      (nonStarterTokens.includes(previousToken.value) && !starterTokens.includes(currentChar))
    ) {
      throw new Error("Unexpected syntax");
    }

    if (currentChar === "-" && uniqueTokens.has(previousToken.value)) {
      if (previousToken.value === "-") {
        tokens.pop();

        const operatorToken = {
          type: TokenTypes.UNIQUE_TOKEN,
          value: "+",
        };

        tokens.push(operatorToken);

        return { token: operatorToken, index: i };
      } else if (previousToken.value === "+") {
        tokens.pop();

        const operatorToken = {
          type: TokenTypes.UNIQUE_TOKEN,
          value: "-",
        };

        tokens.push(operatorToken);

        return { token: operatorToken, index: i };
      }

      const valueToken = {
        type: TokenTypes.VALUE,
        value: "-1",
      };

      tokens.push(valueToken);

      const operatorToken = {
        type: TokenTypes.UNIQUE_TOKEN,
        value: "*",
      };

      tokens.push(operatorToken);

      return { token: operatorToken, index: i };
    }

    if (currentChar === "(") {
      const hasUniqueFunctionOrLogWithPower = tokenContext.isUniqueFunctionOrLogWithPower;

      if (
        hasUniqueFunctionOrLogWithPower &&
        (hasUniqueFunctionOrLogWithPower[hasUniqueFunctionOrLogWithPower.length - 1].hasParenthesis
          ?.remainingOpenedParenthesis.length === 0 ||
          hasUniqueFunctionOrLogWithPower[hasUniqueFunctionOrLogWithPower.length - 1]
            .hasNoParenthesis)
      ) {
      } else if (
        previousToken.type === TokenTypes.VALUE ||
        previousToken.type === TokenTypes.VARIABLE ||
        previousToken.value === "e"
      ) {
        const operatorToken = {
          type: TokenTypes.UNIQUE_TOKEN,
          value: "*",
        };

        tokens.push(operatorToken);
      }
    }

    if (
      (previousToken.type === TokenTypes.VALUE ||
        previousToken.type === TokenTypes.VARIABLE ||
        previousToken.value === "e") &&
      currentChar === "|"
    ) {
      const operatorToken = {
        type: TokenTypes.UNIQUE_TOKEN,
        value: "*",
      };

      tokens.push(operatorToken);
    }

    if (
      (currentChar === "^" && uniqueFunctions.includes(previousToken.value)) ||
      previousToken.value === "log"
    ) {
      if (!tokenContext.isUniqueFunctionOrLogWithPower) {
        tokenContext.isUniqueFunctionOrLogWithPower = [];
      }

      tokenContext.isUniqueFunctionOrLogWithPower.push({});

      const lastUniqueFunctionIndex = tokenContext.isUniqueFunctionOrLogWithPower.length - 1;

      const nextInput = input[i + 1];
      if (nextInput === "(") {
        if (!tokenContext.isUniqueFunctionOrLogWithPower[lastUniqueFunctionIndex].hasParenthesis) {
          tokenContext.isUniqueFunctionOrLogWithPower[lastUniqueFunctionIndex].hasParenthesis = {
            remainingOpenedParenthesis: [],
          };
        }

        tokenContext.isUniqueFunctionOrLogWithPower[
          lastUniqueFunctionIndex
        ].hasParenthesis.remainingOpenedParenthesis.push("(");
      } else {
        tokenContext.isUniqueFunctionOrLogWithPower[lastUniqueFunctionIndex].hasNoParenthesis =
          true;
      }
    }

    if (
      currentChar === "!" &&
      (uniqueWords.includes(previousToken.value) ||
        (previousToken.value !== ")" && uniqueTokens.has(previousToken.value)))
    ) {
      throw new Error("Unexpected syntax");
    }
  }

  const token = {
    type: TokenTypes.UNIQUE_TOKEN,
    value: currentChar,
  };

  tokens.push(token);

  if (currentChar === "(") {
    const hasUniqueFunctionOrLogWithPower = tokenContext.isUniqueFunctionOrLogWithPower;
    if (hasUniqueFunctionOrLogWithPower) {
      const lastUniqueFunctionIndex = hasUniqueFunctionOrLogWithPower.length - 1;
      hasUniqueFunctionOrLogWithPower[
        lastUniqueFunctionIndex
      ].hasParenthesis?.remainingOpenedParenthesis.push("(");
    }

    const hasLogs = tokenContext.isLog;
    if (hasLogs) {
      const lastLogIndex = hasLogs.length - 1;
      hasLogs[lastLogIndex].remainingOpenedParenthesis.push("(");
    }
  }

  if (currentChar === ")") {
    const hasUniqueFunctionOrLogWithPower = tokenContext.isUniqueFunctionOrLogWithPower;
    if (hasUniqueFunctionOrLogWithPower) {
      const lastUniqueFunctionIndex = hasUniqueFunctionOrLogWithPower.length - 1;
      hasUniqueFunctionOrLogWithPower[
        lastUniqueFunctionIndex
      ].hasParenthesis?.remainingOpenedParenthesis.pop();

      hasUniqueFunctionOrLogWithPower.pop();
      if (hasUniqueFunctionOrLogWithPower.length === 0) {
        delete tokenContext.isUniqueFunctionOrLogWithPower;
      }
    }

    const hasLogs = tokenContext.isLog;
    if (hasLogs) {
      const lastLogIndex = hasLogs.length - 1;

      hasLogs[lastLogIndex].remainingOpenedParenthesis.pop();

      if (hasLogs[lastLogIndex].remainingOpenedParenthesis.length === 0) {
        if (!hasLogs[lastLogIndex].hasComa) {
          throw new Error("Unexpected syntax");
        }

        hasLogs.pop();
      }

      if (tokenContext.isLog?.length === 0) {
        delete tokenContext.isLog;
      }
    }

    const nextIndex = getNextNonSpaceCharIndex({ input, i });
    if (nextIndex !== undefined) {
      const followingChar = input[nextIndex + 1];
      const isLetter = isCharacterLetter({ currentChar: followingChar });
      const isNumber = !isNaN(Number.parseFloat(followingChar));

      if (isLetter || isNumber) {
        tokens.push({
          type: TokenTypes.UNIQUE_TOKEN,
          value: "*",
        });
      }

      i = nextIndex;
    }
  }

  if (currentChar === "!") {
    const nextIndex = getNextNonSpaceCharIndex({ input, i });
    if (nextIndex !== undefined) {
      const followingChar = input[nextIndex + 1];
      if (followingChar === "!" || followingChar === "^") {
        throw new Error("Unexpected syntax");
      }
    }
  }

  return { token, index: i };
};
