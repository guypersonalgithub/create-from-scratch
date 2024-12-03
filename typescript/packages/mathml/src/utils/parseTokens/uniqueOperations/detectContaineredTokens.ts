import { ParsedToken } from "../types";
import { recursiveOperations } from "./recursiveOperations";

type DetectParenthesisTokensArgs = {
  tokens: ParsedToken[];
  direction: "rtl" | "ltr";
  isRoot?: boolean;
};

type PushIntoTakenValueArgs = {
  token: ParsedToken;
};

type GetNextTokenArgs = {
  tokens: ParsedToken[];
  isLTR: boolean;
};

export const detectParenthesisTokens = ({
  tokens,
  direction,
  isRoot,
}: DetectParenthesisTokensArgs) => {
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

  const getNextToken = ({ tokens, isLTR }: GetNextTokenArgs) => {
    const nextToken = isLTR ? tokens.shift() : tokens.pop();
    if (!nextToken) {
      throw new Error("Unexpected syntax!");
    }

    return nextToken;
  };

  let token = getNextToken({ tokens, isLTR });
  if (token) {
    pushIntoTakenValue({ token });
  }
  token = getNextToken({ tokens, isLTR });

  while (tokens.length > 0 && parenthesisArray.length > 0) {
    const { value } = token;
    if (typeof value !== "string") {
      pushIntoTakenValue({ token });
      token = getNextToken({ tokens, isLTR });
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
          isRoot,
        });
      } else {
        pushIntoTakenValue({ token });
      }
    }

    if (parenthesisArray.length !== 0) {
      token = getNextToken({ tokens, isLTR });
    }
  }

  if (direction === "ltr") {
    tokensWithinTheParenthesis.push(token);
  } else {
    tokensWithinTheParenthesis.unshift(token);
  }

  return { tokensWithinTheParenthesis };
};

export const detectAbsoluteTokens = ({
  tokens,
  direction,
}: Omit<DetectParenthesisTokensArgs, "test">) => {
  const tokensWithinTheAbsolute: ParsedToken[] = [];

  const isLTR = direction === "ltr";

  const pushIntoTakenValue = ({ token }: PushIntoTakenValueArgs) => {
    if (isLTR) {
      tokensWithinTheAbsolute.push(token);
    } else {
      tokensWithinTheAbsolute.unshift(token);
    }
  };

  let token = isLTR ? tokens.shift() : tokens.pop();

  if (!token) {
    throw new Error("Unexpected syntax!");
  }

  while (tokens.length > 0 && token.value !== "!") {
    const { value } = token;
    if (typeof value !== "string") {
      pushIntoTakenValue({ token });
      continue;
    }

    if (value !== "|") {
      if (isLTR) {
        recursiveOperations({
          tokens,
          token,
          parsedTokensOfTheSameLevel: tokensWithinTheAbsolute,
        });
      } else {
        pushIntoTakenValue({ token });
      }
    }

    token = isLTR ? tokens.shift() : tokens.pop();

    if (!token) {
      throw new Error("Unexpected syntax!");
    }
  }

  tokensWithinTheAbsolute.push(token);

  return { tokensWithinTheAbsolute };
};
