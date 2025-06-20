import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import {
  expressionInterpolationFlow,
  type ExpressionInterpolationFlowArgs,
} from "../expressionInterpolationFlow";
import { spaceFollowUpFlow } from "../genericFlows";

type TemplateLiteralFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
} & TypedFlow;

type TypedFlow =
  | {
      isType?: boolean;
      openedContexts?: never;
    }
  | {
      isType?: never;
      openedContexts: OpenedContext[];
    };

export const templateLiteralFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isType,
}: TemplateLiteralFlowArgs) => {
  if (newTokenValue !== "`") {
    return;
  }

  let completeValue = newTokenValue;
  let foundQuotationSign = false;

  while (currentIndex < input.length) {
    const current = input[currentIndex];

    if (current === "\\") {
      const followingCharacter = input[currentIndex + 1];
      if (followingCharacter === "`") {
        completeValue += `${current}${followingCharacter}`;
        currentIndex += 2;
        continue;
      }
    } else if (current === "$") {
      const followingCharacter = input[currentIndex + 1];
      if (followingCharacter === "{") {
        if (completeValue.length > 0) {
          tokens.push({ type: TokenTypes.STRING, value: completeValue });
          completeValue = "";
        }

        tokens.push({ type: TokenTypes.TEMPLATE_LITERAL_EXPRESSION_INTERPOLATION, value: current });

        const { breakpoint, space } = spaceFollowUpFlow({
          tokens,
          input,
          currentIndex: currentIndex + 1,
          previousTokensSummary,
        });
        const value = expressionInterpolationFlow({
          tokens,
          input,
          previousTokensSummary,
          openedContexts,
          withinTemplateLiteral: true,
          isType,
          ...breakpoint,
        } as ExpressionInterpolationFlowArgs);
        if (!value) {
          return {
            updatedIndex: space?.updatedIndex ?? currentIndex,
            stop: true,
          };
        }

        if (value.stop) {
          return value;
        }

        currentIndex = value.updatedIndex;

        continue;
      }
    } else if (current === "`") {
      foundQuotationSign = true;
      completeValue += current;
      currentIndex++;
      break;
    }

    completeValue += current;
    currentIndex++;
  }

  tokens.push({
    type: TokenTypes.STRING,
    value: completeValue,
  });
  previousTokensSummary.push(TokenTypes.STRING);

  return {
    updatedIndex: currentIndex,
    stop: !foundQuotationSign,
  };
};
