import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";

type CanValueBeAnArgumentFlowArgs = {
  tokens: BaseToken[];
  amountOfTokens: number;
  currentSavedIndex: number;
};

export const canValueBeAnArgumentFlow = ({
  tokens,
  amountOfTokens,
}: CanValueBeAnArgumentFlowArgs) => {
  const newAmount = tokens.length;

  const acceptableFunctionArgumentTokens = [
    TokenTypes.VARIABLE,
    TokenTypes.ARRAY_SQUARE_BRACKET,
    TokenTypes.OBJECT_CURLY_BRACKET,
    TokenTypes.OBJECT_PROPERTY,
    TokenTypes.OBJECT_COLON,
    TokenTypes.COMMA,
    TokenTypes.WHITESPACE,
  ];

  const acceptable = new Set<TokenTypeOptions>(acceptableFunctionArgumentTokens);

  for (let i = amountOfTokens; i < newAmount; i++) {
    // TODO: Consider adding type conversation for values into a new token type, as they are just treated as renames assuming it is an argument.
    if (!acceptable.has(tokens[i].type)) {
      return false;
    }
  }

  return true;
};
