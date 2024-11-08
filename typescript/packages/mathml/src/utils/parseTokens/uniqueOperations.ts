import { operators, TokenTypes, uniqueFunctions } from "@packages/math-parser";
import { ParsedToken } from "./types";
import { convertMinuses, convertMultiplications } from "./converts";
import { detectAbsoluteTokens, detectParenthesisTokens } from "./detectParenthesisOrAbsolute";
import { UniqueMathMLTokens } from "./constants";

type FindUniqueOperationsArgs = {
  tokens: ParsedToken[];
  token: ParsedToken;
  parsedTokens: ParsedToken[];
};

export const findUniqueOperations = ({ tokens, token, parsedTokens }: FindUniqueOperationsArgs) => {
  const { type, value } = token;

  if (
    type !== TokenTypes.KEYWORD &&
    typeof value === "string" &&
    !operators.has(value) &&
    value !== "!"
  ) {
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
  } else if (value === "!") {
    parsedTokens.push(recursivelyParseFactorial({ parsedTokensOfTheSameLevel: parsedTokens }));
  } else if (value === "log") {
    parsedTokens.push(recursivelyParseLog({ tokens }));
  } else if (typeof value === "string" && uniqueFunctions.includes(value)) {
    parsedTokens.push(recursivelyParseUniqueFunction({ func: value, tokens }));
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
    } else if (token.value === "!") {
      parsedTokensOfTheSameLevel.push(recursivelyParseFactorial({ parsedTokensOfTheSameLevel }));
    } else if (token.value === "log") {
      parsedTokensOfTheSameLevel.push(recursivelyParseLog({ tokens }));
    } else if (typeof token.value === "string" && uniqueFunctions.includes(token.value)) {
      parsedTokensOfTheSameLevel.push(
        recursivelyParseUniqueFunction({ func: token.value, tokens }),
      );
    } else {
      parsedTokensOfTheSameLevel.push(token);
    }
  }
};

type RecursivelyParseArgs = {
  tokens: ParsedToken[];
};

const recursivelyParseSqrt = ({ tokens }: RecursivelyParseArgs) => {
  const value: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
    value.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    value.push(...tokensWithinTheAbsolute);
  } else {
    let token = tokens.shift() as ParsedToken | undefined;

    if (!token) {
      throw new Error("Unexpected syntax!");
    }

    if (token.value !== "(" && token.value !== "sqrt") {
      value.push(initialToken);
    }

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: value });
    }
  }

  return {
    type: UniqueMathMLTokens.SQRT,
    value,
  };
};

type RecursivelyParseWithBackwardsArgs = RecursivelyParseArgs & {
  parsedTokensOfTheSameLevel: ParsedToken[];
};

const recursivelyParsePower = ({
  tokens,
  parsedTokensOfTheSameLevel,
}: RecursivelyParseWithBackwardsArgs) => {
  const power: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens,
      direction: "ltr",
    });
    power.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    power.push(...tokensWithinTheAbsolute);
  } else {
    let token = tokens.shift() as ParsedToken | undefined;

    if (!token) {
      throw new Error("Unexpected syntax!");
    }

    if (token.value !== "(" && token.value !== "^") {
      power.push(initialToken);
    }

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: power });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  const base: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel[parsedTokensOfTheSameLevel.length - 1];

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    base.push(...tokensWithinTheParenthesis);
  } else if (lastValueToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    base.push(...tokensWithinTheAbsolute);
  } else {
    let token = parsedTokensOfTheSameLevel.pop() as ParsedToken | undefined;
    if (token) {
      base.unshift(token);
    }

    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      base.unshift(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  return {
    type: UniqueMathMLTokens.POWER,
    value: {
      base,
      power,
    },
  };
};

const recursivelyParseFraction = ({
  tokens,
  parsedTokensOfTheSameLevel,
}: RecursivelyParseWithBackwardsArgs) => {
  const denominator: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
    denominator.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    denominator.push(...tokensWithinTheAbsolute);
  } else {
    let token = tokens.shift() as ParsedToken | undefined;

    if (!token) {
      throw new Error("Unexpected syntax!");
    }

    if (token.value !== "(" && token.value !== "/") {
      denominator.push(initialToken);
    }

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: denominator });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  const numerator: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel[parsedTokensOfTheSameLevel.length - 1];

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    numerator.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));
  } else if (lastValueToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    numerator.push(...tokensWithinTheAbsolute);
  } else {
    let token = parsedTokensOfTheSameLevel.pop() as ParsedToken | undefined;
    if (token) {
      numerator.unshift(token);
    }

    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      numerator.unshift(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  return {
    type: UniqueMathMLTokens.FRACTION,
    value: {
      numerator,
      denominator,
    },
  };
};

type RecursivelyParseUniqueFunctionArgs = {
  func: string;
  tokens: ParsedToken[];
};

const recursivelyParseUniqueFunction = ({ func, tokens }: RecursivelyParseUniqueFunctionArgs) => {
  const value: ParsedToken[] = [
    {
      type: TokenTypes.UNIQUE_TOKEN,
      value: func,
    },
  ];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens,
      direction: "ltr",
    });
    value.push(...tokensWithinTheParenthesis);
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    value.push(...tokensWithinTheAbsolute);
  } else {
    let token = undefined as ParsedToken | undefined;

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: value });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  if (initialToken.value === "^") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens,
      direction: "ltr",
    });
    value.push(...tokensWithinTheParenthesis);
  }

  return {
    type: UniqueMathMLTokens.UNIQUE_FUNCTION,
    value,
  };
};

const recursivelyParseFactorial = ({
  parsedTokensOfTheSameLevel,
}: Pick<RecursivelyParseWithBackwardsArgs, "parsedTokensOfTheSameLevel">) => {
  const value: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel[parsedTokensOfTheSameLevel.length - 1];

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    value.push(...tokensWithinTheParenthesis);
  } else if (lastValueToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    value.push(...tokensWithinTheAbsolute);
  } else {
    let token = parsedTokensOfTheSameLevel.pop() as ParsedToken | undefined;
    if (token) {
      value.unshift(token);
    }

    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      value.unshift(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  value.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: "!",
  });

  return {
    type: UniqueMathMLTokens.FACTORIAL,
    value,
  };
};

type RecursivelyParseLogArgs = {
  tokens: ParsedToken[];
};

const recursivelyParseLog = ({ tokens }: RecursivelyParseLogArgs) => {
  const func = {
    type: TokenTypes.UNIQUE_TOKEN,
    value: "log",
  };
  const base: ParsedToken[] = [];
  const value: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens,
      direction: "ltr",
    });
    const parenthesisLessTokens = tokensWithinTheParenthesis.slice(
      1,
      tokensWithinTheParenthesis.length - 1,
    );
    const comaToken = parenthesisLessTokens.findIndex((token) => token.value === ",");
    if (comaToken === -1) {
      throw new Error("Unexpected syntax");
    }

    for (let i = 0; i < comaToken; i++) {
      const current = parenthesisLessTokens[i];
      base.push(current);
    }

    for (let i = comaToken + 1; i < parenthesisLessTokens.length; i++) {
      const current = parenthesisLessTokens[i];
      value.push(current);
    }
  }

  // TODO: Add support to that through the tokenizer

  //  else if (initialToken.value === "|") {
  //   const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
  //   const parenthesisLessTokens = tokensWithinTheAbsolute.slice(
  //     1,
  //     tokensWithinTheAbsolute.length - 1,
  //   );
  //   const comaToken = parenthesisLessTokens.findIndex((token) => token.value === ",");
  //   if (comaToken === -1) {
  //     throw new Error("Unexpected syntax");
  //   }

  //   for (let i = 0; i < comaToken; i++) {
  //     const current = parenthesisLessTokens[i];
  //     base.push(current);
  //   }

  //   for (let i = comaToken + 1; i < parenthesisLessTokens.length; i++) {
  //     const current = parenthesisLessTokens[i];
  //     value.push(current);
  //   }
  // }

  // TODO: Add support to that through the tokenizer

  // if (initialToken.value === "^") {
  //   const { tokensWithinTheParenthesis } = detectParenthesisTokens({
  //     tokens,
  //     direction: "ltr",
  //   });
  //   value.push(...tokensWithinTheParenthesis);
  // }

  // console.log(tokens.slice());

  return {
    type: UniqueMathMLTokens.LOG,
    value: {
      func,
      base,
      value,
    },
  };
};
