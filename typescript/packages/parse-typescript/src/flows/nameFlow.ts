import { shouldBreak } from "../utils";

type NameFlowProps = {
  newTokenValue: string;
  currentIndex: number;
};

export const nameFlow = ({ newTokenValue, currentIndex }: NameFlowProps) => {
  const firstChar = newTokenValue.charAt(0);
  const isIncorrectName =
    shouldBreak({
      currentChar: firstChar,
    }) && firstChar !== "_";

  if (isIncorrectName) {
    return {
      updatedIndex: currentIndex - newTokenValue.length,
      stop: true,
    };
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
