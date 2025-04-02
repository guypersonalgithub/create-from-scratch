import { stringDefinitions, TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";

type StringFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  isObjectKey?: boolean;
  isType?: boolean;
};

export const stringFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  isObjectKey,
  isType,
}: StringFlowArgs) => {
  if (!newTokenValue) {
    return;
  }

  const firstChar = newTokenValue.charAt(0);
  if (!stringDefinitions.has(firstChar)) {
    return;
  }

  let completeValue = firstChar;
  let quotationSign = firstChar;
  let foundQuotationSign = false;

  while (currentIndex < input.length) {
    const current = input[currentIndex];

    if (current === "\\") {
      const followingCharacter = input[currentIndex + 1];
      if (followingCharacter === quotationSign) {
        completeValue += `${current}${followingCharacter}`;
        currentIndex += 2;
        continue;
      }
    } else if (current === quotationSign) {
      foundQuotationSign = true;
      completeValue += current;
      currentIndex++;
      break;
    } else if (current === "\n") {
      completeValue += current;
      currentIndex++;
      break;
    }

    completeValue += current;
    currentIndex++;
  }

  let tokenType;

  if (!isType) {
    tokenType = !isObjectKey ? TokenTypes.STRING : TokenTypes.OBJECT_STRING_PROPERTY;
  } else {
    tokenType = !isObjectKey ? TokenTypes.STRING_TYPE : TokenTypes.OBJECT_STRING_TYPE_PROPERTY;
  }

  tokens.push({
    type: tokenType,
    value: completeValue,
  });
  previousTokensSummary.push(tokenType);

  return {
    updatedIndex: currentIndex,
    stop: !foundQuotationSign,
  };
};
