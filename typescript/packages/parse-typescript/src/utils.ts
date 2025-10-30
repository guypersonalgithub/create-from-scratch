import { type BaseToken } from "./types";
import { spaceFlow } from "./flows/genericFlows";
import { type TokenTypeOptions, TokenTypes, breakpoints } from "./constants";
import { getNextNonSpaceCharIndex } from "@packages/string-utils";
import { variablePropertyFlow } from "./flows/variablePropertyFlow";

type FindNextBreakpointArgs = {
  input: string;
  currentIndex: number;
};

export const findNextBreakpoint = ({ input, currentIndex }: FindNextBreakpointArgs) => {
  // Consider adding a case where input.length === currentIndex.
  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: input.slice(currentIndex) });
  if (skippedIndexes) {
    return {
      currentIndex: currentIndex + skippedIndexes,
      newTokenValue: input.slice(currentIndex, currentIndex + skippedIndexes),
    };
  }

  const currentChar = input[currentIndex];
  let newTokenValue = currentChar;
  currentIndex++;

  if (shouldBreak({ currentChar })) {
    return {
      currentIndex,
      newTokenValue,
    };
  }

  while (currentIndex < input.length) {
    const currentChar = input[currentIndex];
    if (shouldBreak({ currentChar })) {
      return {
        currentIndex,
        newTokenValue,
      };
    }

    newTokenValue += currentChar;
    currentIndex++;
  }

  return {
    currentIndex,
    newTokenValue,
  };
};

type ShouldBreakArgs = {
  currentChar: string;
};

export const shouldBreak = ({ currentChar }: ShouldBreakArgs) => {
  return breakpoints.has(currentChar);
};

export type StepCallback<SharedData extends Record<string, unknown> = {}> = {
  callback: (
    arg: ReturnType<typeof findNextBreakpoint>,
    arg2?: SharedData,
  ) =>
    | ({
        updatedIndex: number;
        stop: boolean;
        exit?: boolean;
      } & SharedData)
    | undefined;
  stop: boolean;
};

type IterateOverStepsArgs<SharedData extends Record<string, unknown> = {}> = {
  input: string;
  currentIndex: number;
  stepCallbacks: StepCallback<SharedData>[];
  previousSharedData?: SharedData;
};

export const iterateOverSteps = <SharedData extends Record<string, unknown> = {}>({
  input,
  currentIndex,
  stepCallbacks,
  previousSharedData = {} as SharedData,
}: IterateOverStepsArgs<SharedData>) => {
  let sharedData: SharedData = previousSharedData;

  for (let i = 0; i < stepCallbacks.length; i++) {
    const breakpoint = findNextBreakpoint({ input, currentIndex });
    const currentStep = stepCallbacks[i];

    // if (breakpoint.currentIndex >= input.length) {
    //   break;
    // }

    if (breakpoint.currentIndex > input.length) {
      break;
    }

    const { updatedIndex, stop, exit, ...rest } = currentStep.callback(breakpoint, sharedData) ?? {
      updatedIndex: currentIndex,
      stop: false,
      exit: false,
    };

    if (exit) {
      return {
        updatedIndex,
        // updatedIndex: currentIndex,
        stop: false,
        exit: true,
        sharedData,
        i,
      };
    }

    sharedData = { ...sharedData, ...rest };

    if (stop && currentStep.stop) {
      return {
        updatedIndex,
        stop,
        i,
        sharedData,
      };
    }

    currentIndex = updatedIndex;
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
    sharedData,
  };
};

type SpaceCallbackArgs = {
  tokens: BaseToken[];
  input: string;
  stop: boolean;
  previousTokensSummary: TokenTypeOptions[];
};

export const spaceCallback = ({
  tokens,
  input,
  stop,
  previousTokensSummary,
}: SpaceCallbackArgs): StepCallback => {
  return {
    callback: ({ currentIndex, newTokenValue }) => {
      return definitionSpaceHelper({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
      });
    },
    stop,
  };
};

type DotCallbackArgs = {
  tokens: BaseToken[];
  stop: boolean;
  previousTokensSummary: TokenTypeOptions[];
  exit?: boolean;
};

export const dotCallback = ({
  tokens,
  stop,
  previousTokensSummary,
  exit,
}: DotCallbackArgs): StepCallback => {
  return {
    callback: ({ currentIndex, newTokenValue }) => {
      const hasDot = definitionDotHelper({
        tokens,
        newTokenValue,
        currentIndex,
        previousTokensSummary,
      });

      if (!hasDot.stop) {
        return {
          ...hasDot,
          exit,
        };
      }

      return hasDot;

      // if (newTokenValue !== ".") {
      //   return {
      //     updatedIndex: currentIndex - newTokenValue.length,
      //     stop: true,
      //   };
      // }

      // tokens.push({ type: TokenTypes.OPERATOR, value: newTokenValue });
      // previousTokensSummary.push(TokenTypes.OPERATOR);

      // return {
      //   updatedIndex: currentIndex,
      //   stop: false,
      //   exit,
      // };
    },
    stop,
  };
};

type DefinitionDotHelperArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

const definitionDotHelper = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: DefinitionDotHelperArgs) => {
  const dotProperties = variablePropertyFlow({
    tokens,
    newTokenValue,
    currentIndex,
    previousTokensSummary,
  });

  if (!dotProperties) {
    return {
      updatedIndex: currentIndex - newTokenValue.length,
      stop: true,
    };
  }

  return dotProperties;
};

type DefinitionSpaceHelperArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const definitionSpaceHelper = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: DefinitionSpaceHelperArgs) => {
  const spaceProperties = spaceFlow({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!spaceProperties) {
    return {
      updatedIndex: currentIndex - (newTokenValue?.length ?? 0),
      stop: true,
    };
  }

  return spaceProperties;
};

type FindLastNonSpaceTokenArgs = {
  tokens: BaseToken[];
};

export const findLastNonSpaceToken = ({ tokens }: FindLastNonSpaceTokenArgs) => {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].type !== TokenTypes.WHITESPACE) {
      return tokens[i];
    }
  }

  return undefined;
};

type FindLastNonPreviousSpaceTokenArgs = {
  previousTokensSummary: TokenTypeOptions[];
};

export const findLastNonPreviousSpaceToken = ({
  previousTokensSummary,
}: FindLastNonPreviousSpaceTokenArgs) => {
  for (let i = previousTokensSummary.length - 1; i >= 0; i--) {
    if (previousTokensSummary[i] !== TokenTypes.WHITESPACE) {
      return previousTokensSummary[i];
    }
  }

  return undefined;
};
