import { operators } from "@packages/math-parser";
import { ParsedToken } from "./types";
import { convertMinuses, convertMultiplications } from "./converts";
import { detectParenthesisTokens } from "./detectParenthesis";

type FindUniqueOperationsArgs = {
  tokens: ParsedToken[];
  token: ParsedToken;
  parsedTokens: ParsedToken[];
};

export const findUniqueOperations = ({ tokens, token, parsedTokens }: FindUniqueOperationsArgs) => {
  const { type, value } = token;
  if (type !== "keyword" && typeof value === "string" && !operators.has(value)) {
    return false;
  }

  if (value === "sqrt") {
    parsedTokens.push(recursivelyParseSqrt({ tokens }));
  } else if (value === "^") {
    parsedTokens.push(recursivelyParsePower({ tokens, parsedTokensOfTheSameLevel: parsedTokens }));
  } else if (value === "/") {
    parsedTokens.push(
      recursivelyParseFraction({ tokens, parsedTokensOfTheSameLevel: parsedTokens }),
    );
  } else {
    parsedTokens.push(token);
  }

  return true;
};

type RecursiveOperationsArgs = {
  tokens: ParsedToken[];
  token: ParsedToken;
  parsedTokensOfTheSameLevel: ParsedToken[];
};

export const recursiveOperations = ({
  tokens,
  token,
  parsedTokensOfTheSameLevel,
}: RecursiveOperationsArgs) => {
  if (typeof token?.value !== "string") {
    parsedTokensOfTheSameLevel.push(token);
    return;
  }

  const convertedMinus = convertMinuses({
    token,
    nextToken: tokens[0],
    parsedTokens: parsedTokensOfTheSameLevel,
    tokens,
  });
  if (convertedMinus) {
    // tokens.shift();
  } else {
    const convertMultiplication = convertMultiplications({
      token,
      nextToken: tokens[0],
      parsedTokens: parsedTokensOfTheSameLevel,
      tokens,
    });

    if (convertMultiplication) {
    } else if (token.value === "sqrt") {
      parsedTokensOfTheSameLevel.push(recursivelyParseSqrt({ tokens }));
    } else if (token.value === "^") {
      parsedTokensOfTheSameLevel.push(
        recursivelyParsePower({ tokens, parsedTokensOfTheSameLevel }),
      );
    } else if (token.value === "/") {
      parsedTokensOfTheSameLevel.push(
        recursivelyParseFraction({ tokens, parsedTokensOfTheSameLevel }),
      );
    } else {
      parsedTokensOfTheSameLevel.push(token);
    }
  }
};

type RecursivelyParseArgs = {
  tokens: ParsedToken[];
};

export const recursivelyParseSqrt = ({ tokens }: RecursivelyParseArgs) => {
  const value: ParsedToken[] = [];

  const initialToken = tokens.shift();
  if (!initialToken) {
    throw new Error("Unexpected syntax!");
  }

  if (initialToken.value !== "(" && initialToken.value !== "sqrt") {
    value.push(initialToken);
  }

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
    value.push(...tokensWithinTheParenthesis);
  } else {
    let token = { ...initialToken } as ParsedToken | undefined;

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === "value" ||
        token?.type === "variable" ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: value });
    }
  }

  return {
    type: "sqrt",
    value,
  };
};

type RecursivelyParseWithBackwardsArgs = RecursivelyParseArgs & {
  parsedTokensOfTheSameLevel: ParsedToken[];
};

export const recursivelyParsePower = ({
  tokens,
  parsedTokensOfTheSameLevel,
}: RecursivelyParseWithBackwardsArgs) => {
  const power: ParsedToken[] = [];

  const initialToken = tokens.shift();
  if (!initialToken) {
    throw new Error("Unexpected syntax!");
  }

  if (initialToken.value !== "(" && initialToken.value !== "^") {
    power.push(initialToken);
  }

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
    power.push(...tokensWithinTheParenthesis);
  } else {
    let token = { ...initialToken } as ParsedToken | undefined;

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === "value" ||
        token?.type === "variable" ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: power });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  const base: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel.pop();
  if (!lastValueToken) {
    throw new Error("Unexpected syntax!");
  }

  if (lastValueToken.value !== ")") {
    base.push(lastValueToken);
  }

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    tokensWithinTheParenthesis.unshift({
      type: "uniqueToken",
      value: "(",
    });
    tokensWithinTheParenthesis.push({
      type: "uniqueToken",
      value: ")",
    });
    base.push(...tokensWithinTheParenthesis);
  } else {
    let token = { ...lastValueToken } as ParsedToken | undefined;
    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === "sqrt" ||
        token?.type === "power" ||
        token?.type === "value" ||
        token?.type === "variable" ||
        typeof token?.value !== "string")
    ) {
      base.push(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  return {
    type: "power",
    value: {
      base,
      power,
    },
  };
};

export const recursivelyParseFraction = ({
  tokens,
  parsedTokensOfTheSameLevel,
}: RecursivelyParseWithBackwardsArgs) => {
  const denominator: ParsedToken[] = [];

  const initialToken = tokens.shift();
  if (!initialToken) {
    throw new Error("Unexpected syntax!");
  }

  if (initialToken.value !== "(" && initialToken.value !== "/") {
    denominator.push(initialToken);
  }

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
    denominator.push(...tokensWithinTheParenthesis);
  } else {
    let token = { ...initialToken } as ParsedToken | undefined;

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === "value" ||
        token?.type === "variable" ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: denominator });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  const numerator: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel.pop();
  if (!lastValueToken) {
    throw new Error("Unexpected syntax!");
  }

  if (lastValueToken.value !== ")") {
    numerator.push(lastValueToken);
  }

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    numerator.push(...tokensWithinTheParenthesis);
  } else {
    let token = { ...lastValueToken } as ParsedToken | undefined;
    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === "sqrt" ||
        token?.type === "power" ||
        token?.type === "value" ||
        token?.type === "variable" ||
        typeof token?.value !== "string")
    ) {
      numerator.push(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  return {
    type: "fraction",
    value: {
      numerator,
      denominator,
    },
  };
};
