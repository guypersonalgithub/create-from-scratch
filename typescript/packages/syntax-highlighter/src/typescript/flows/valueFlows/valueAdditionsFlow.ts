import { TokenTypeOptions } from "../../constants";
import { BaseToken } from "../../types";
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
};

type Return =
  | {
      updatedIndex: number;
      stop: boolean;
      addedAs?: boolean;
      addedAndOr?: boolean;
      addedTernary?: boolean;
      addedLowerHigherThan?: boolean;
      addedArithmetic?: boolean;
      addedEqualUnequal?: boolean;
    }
  | undefined;

export const valueAdditionsFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
}: ValueAdditionsFlowArgs): Return => {
  let addedAs = false;
  let addedAndOr = false;
  let addedTernary = false;
  let addedLowerHigherThan = false;
  let addedArithmetic = false;
  let addedEqualUnequal = false;

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const as = asFlow({ tokens, input, previousTokensSummary, ...breakpoint });

  if (as) {
    if (as.stop) {
      return as;
    }

    addedAs = true;

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: as.updatedIndex,
      previousTokensSummary,
    });

    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  const andOr = andOrValueFlow({ tokens, input, previousTokensSummary, ...breakpoint });

  if (andOr) {
    if (andOr.stop) {
      return andOr;
    }

    addedAndOr = true;

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: andOr.updatedIndex,
      previousTokensSummary,
    });

    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  const ternary = ternaryValueFlow({ tokens, input, previousTokensSummary, ...breakpoint });

  if (ternary) {
    if (ternary.stop) {
      return ternary;
    }

    addedTernary = true;

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: ternary.updatedIndex,
      previousTokensSummary,
    });

    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  const lowerHigherThan = lowerHigherThanValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (lowerHigherThan) {
    if (lowerHigherThan.stop) {
      return lowerHigherThan;
    }

    addedLowerHigherThan = true;

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: lowerHigherThan.updatedIndex,
      previousTokensSummary,
    });

    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  const arithmetic = arithmeticsValueFlow({ tokens, input, previousTokensSummary, ...breakpoint });

  if (arithmetic) {
    if (arithmetic.stop) {
      return arithmetic;
    }

    addedArithmetic = true;

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: arithmetic.updatedIndex,
      previousTokensSummary,
    });

    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  const equalUnequal = equalUnequalValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (equalUnequal) {
    if (equalUnequal.stop) {
      return equalUnequal;
    }

    addedEqualUnequal = true;
  }

  let updatedIndex =
    equalUnequal?.updatedIndex ??
    arithmetic?.updatedIndex ??
    lowerHigherThan?.updatedIndex ??
    ternary?.updatedIndex ??
    andOr?.updatedIndex ??
    as?.updatedIndex ??
    space?.updatedIndex ??
    currentIndex;

  if (
    addedAs ||
    addedAndOr ||
    addedTernary ||
    addedLowerHigherThan ||
    addedArithmetic ||
    addedEqualUnequal
  ) {
    const followup = valueAdditionsFlow({
      tokens,
      input,
      currentIndex: updatedIndex,
      previousTokensSummary,
    });

    if (followup) {
      if (followup.stop) {
        return {
          updatedIndex: followup.updatedIndex,
          stop: true,
        };
      }

      updatedIndex = followup.updatedIndex;
      addedAs = followup.addedAs || addedAs;
      addedAndOr = followup.addedAndOr || addedAndOr;
      addedTernary = followup.addedTernary || addedTernary;
      addedLowerHigherThan = followup.addedLowerHigherThan || addedLowerHigherThan;
      addedArithmetic = followup.addedArithmetic || addedArithmetic;
      addedEqualUnequal = followup.addedEqualUnequal || addedEqualUnequal;
    }
  }

  return {
    updatedIndex,
    stop: false,
    addedAs,
    addedAndOr,
    addedTernary,
    addedLowerHigherThan,
    addedArithmetic,
    addedEqualUnequal,
  };
};
