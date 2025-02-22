import { BaseToken } from "./types";
import { spaceFlow } from "./flows/spaceFlow";
import { TokenTypeOptions, TokenTypes, breakpoints } from "./constants";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type FindNextBreakpointArgs = {
  input: string;
  currentIndex: number;
};

export const findNextBreakpoint = ({ input, currentIndex }: FindNextBreakpointArgs) => {
  const { skippedIndexes } = getNextNonSpaceCharIndex({ input });
  if (skippedIndexes) {
    return {
      currentIndex: currentIndex + skippedIndexes,
      newTokenValue: input.slice(currentIndex, skippedIndexes),
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
      updatedIndex: currentIndex - newTokenValue.length,
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
