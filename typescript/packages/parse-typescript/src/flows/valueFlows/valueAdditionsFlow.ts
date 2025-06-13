import { type TokenTypeOptions } from "../../constants";
import { type BaseToken, type FlowCallback, type OpenedContext } from "../../types";
import { andOrValueFlow } from "./andOrValueFlow";
import { spaceFollowUpFlow } from "../genericFlows";
import { lowerHigherThanValueFlow } from "./lowerHigherThanValueFlow";
import { ternaryValueFlow } from "./ternaryValueFlow";
import { asFlow } from "../typeFlows";
import { arithmeticsValueFlow } from "./arithmeticsValueFlow";
import { equalUnequalValueFlow } from "./equalUnequalValueFlow";

type ValueAdditionsFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isFromAndOrValueFlow?: boolean;
};

type Return = {
  updatedIndex: number;
  stop: boolean;
  addedAs?: boolean;
  addedAndOr?: boolean;
  addedTernary?: boolean;
  addedLowerHigherThan?: boolean;
  addedArithmetic?: boolean;
  addedEqualUnequal?: boolean;
  hasArrow?: boolean;
  hasFunction?: boolean;
};

export const valueAdditionsFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isFromAndOrValueFlow,
}: ValueAdditionsFlowArgs): Return => {
  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const callbacks: FlowCallback[] = [
    () => asFlow({ tokens, input, previousTokensSummary, ...breakpoint }),
    () => andOrValueFlow({ tokens, input, previousTokensSummary, openedContexts, ...breakpoint }),
    () => ternaryValueFlow({ tokens, input, previousTokensSummary, openedContexts, ...breakpoint }),
    () =>
      lowerHigherThanValueFlow({
        tokens,
        input,
        previousTokensSummary,
        openedContexts,
        ...breakpoint,
      }),
    () =>
      arithmeticsValueFlow({ tokens, input, previousTokensSummary, openedContexts, ...breakpoint }),
    () =>
      equalUnequalValueFlow({
        tokens,
        input,
        previousTokensSummary,
        openedContexts,
        ...breakpoint,
      }),
  ];

  let addedAs = false;
  let addedAndOr = false;
  let addedTernary = false;
  let addedLowerHigherThan = false;
  let addedArithmetic = false;
  let addedEqualUnequal = false;

  for (let i = 0; i < callbacks.length; i++) {
    if (isFromAndOrValueFlow && i === 1) {
      continue;
    }

    const current = callbacks[i];
    const response = current();
    if (!response) {
      continue;
    }

    const { updatedIndex: newIndex, stop, hasArrow, hasFunction } = response;

    if (stop) {
      return {
        updatedIndex: newIndex,
        stop: true,
      };
    }

    switch (i) {
      case 0: {
        addedAs = true;
        break;
      }
      case 1: {
        addedAndOr = true;
        break;
      }
      case 2: {
        addedTernary = true;
        break;
      }
      case 3: {
        addedLowerHigherThan = true;
        break;
      }
      case 4: {
        addedArithmetic = true;
        break;
      }
      case 5: {
        addedEqualUnequal = true;
        break;
      }
    }

    currentIndex = newIndex;

    const hasAddition =
      addedAs ||
      addedAndOr ||
      addedTernary ||
      addedLowerHigherThan ||
      addedArithmetic ||
      addedEqualUnequal;

    if (hasAddition) {
      const followup = valueAdditionsFlow({
        tokens,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      });

      if (followup) {
        if (followup.stop) {
          return {
            updatedIndex: followup.updatedIndex,
            stop: true,
          };
        }

        currentIndex = followup.updatedIndex;
        addedAs = followup.addedAs || addedAs;
        addedAndOr = followup.addedAndOr || addedAndOr;
        addedTernary = followup.addedTernary || addedTernary;
        addedLowerHigherThan = followup.addedLowerHigherThan || addedLowerHigherThan;
        addedArithmetic = followup.addedArithmetic || addedArithmetic;
        addedEqualUnequal = followup.addedEqualUnequal || addedEqualUnequal;
      }
    }

    return {
      updatedIndex: currentIndex,
      stop: false,
      hasArrow,
      hasFunction,
      addedAs,
      addedAndOr,
      addedTernary,
      addedLowerHigherThan,
      addedArithmetic,
      addedEqualUnequal,
    };
  }

  return {
    updatedIndex: space?.updatedIndex ?? currentIndex,
    stop: false,
  };
};
