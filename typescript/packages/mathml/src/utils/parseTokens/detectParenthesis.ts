import { ParsedToken } from "./types";
import { recursiveOperations } from "./uniqueOperations";

type DetectParenthesisTokensArgs = {
  tokens: ParsedToken[];
  direction: "rtl" | "ltr";
};

type PushIntoTakenValueArgs = {
  token: ParsedToken;
};

export const detectParenthesisTokens = ({ tokens, direction }: DetectParenthesisTokensArgs) => {
  const tokensWithinTheParenthesis: ParsedToken[] = [];
  const parenthesisArray: string[] = [];

  const isLTR = direction === "ltr";

  const parenthesisStart = isLTR ? "(" : ")";
  const parenthesisEnd = isLTR ? ")" : "(";

  parenthesisArray.push(parenthesisStart);

  const pushIntoTakenValue = ({ token }: PushIntoTakenValueArgs) => {
    if (isLTR) {
      tokensWithinTheParenthesis.push(token);
    } else {
      tokensWithinTheParenthesis.unshift(token);
    }
  };

  while (tokens.length > 0 && parenthesisArray.length > 0) {
    const token = isLTR ? tokens.shift() : tokens.pop();

    if (!token) {
      throw new Error("Unexpected syntax!");
    }

    const { value } = token;
    if (typeof value !== "string") {
      pushIntoTakenValue({ token });
      continue;
    }

    if (value === parenthesisStart) {
      parenthesisArray.push(parenthesisStart);
    } else if (value === parenthesisEnd) {
      parenthesisArray.pop();
    }

    if (!(value === parenthesisEnd && parenthesisArray.length === 0)) {
      if (isLTR) {
        recursiveOperations({
          tokens,
          token,
          parsedTokensOfTheSameLevel: tokensWithinTheParenthesis,
        });
      } else {
        pushIntoTakenValue({ token });
      }
    }
  }

  return { tokensWithinTheParenthesis };
};
