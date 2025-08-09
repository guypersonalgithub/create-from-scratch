import { type Callback } from "./types";
import { spaceCallback, findNextBreakpoint, isntVariableName } from "./utils";
import { stringFlow } from "./stringFlow";

export const importFlow = ({
  input,
  currentIndex,
  identifier,
  uniqueImports,
  mappedImports,
  importVariables,
  openContexts,
}: Callback) => {
  if (openContexts.length > 0) {
    return { updatedIndex: currentIndex };
  }

  const space1 = spaceCallback({ input, currentIndex });

  if (space1.newTokenValue === ".") {
    return { updatedIndex: space1.updatedIndex };
  }

  const tokens: string[] = [];

  const exportDefaultFollowup = exportDefaultVariable({
    tokens,
    input,
    newTokenValue: space1.newTokenValue,
    currentIndex,
  });

  if (exportDefaultFollowup) {
    if (!exportDefaultFollowup.end) {
      const exportVariablesFollowup = exportVariables({
        tokens,
        input,
        newTokenValue: exportDefaultFollowup.newTokenValue,
        currentIndex: exportDefaultFollowup.updatedIndex,
      });

      currentIndex = exportVariablesFollowup.updatedIndex;
    } else {
      currentIndex = exportDefaultFollowup.updatedIndex;
    }
  } else {
    const exportVariablesFollowup = exportVariables({
      tokens,
      input,
      newTokenValue: space1.newTokenValue,
      currentIndex: space1.updatedIndex,
    });

    currentIndex = exportVariablesFollowup.updatedIndex;
  }

  const from = spaceCallback({ input, currentIndex });
  const theImport = stringFlow({
    newTokenValue: from.newTokenValue,
    input,
    currentIndex: from.updatedIndex,
  });

  if (theImport.value) {
    if (theImport.value.includes(identifier)) {
      uniqueImports[theImport.value] = tokens;
      uniqueImports[identifier] = tokens;
    } else {
      mappedImports[theImport.value] = tokens;
      tokens.forEach((token) => {
        importVariables[token] = theImport.value;
      });
    }
  }

  return { updatedIndex: theImport.updatedIndex };
};

type ExportDefaultVariableArgs = {
  tokens: string[];
  input: string;
  newTokenValue: string;
  currentIndex: number;
};

const exportDefaultVariable = ({
  tokens,
  input,
  newTokenValue,
  currentIndex,
}: ExportDefaultVariableArgs) => {
  const firstChar = newTokenValue.charAt(0);
  const isIncorrectExportDefault = isntVariableName({ firstChar });

  if (isIncorrectExportDefault) {
    return;
  }

  tokens.push(newTokenValue);

  const space1 = spaceCallback({ input, currentIndex });

  if (space1.newTokenValue === ",") {
    const space2 = spaceCallback({ input, currentIndex: space1.updatedIndex });

    return { ...space2, end: false };
  }

  return { ...space1, end: true };
};

// TODO:
// const asteriskExportDefaultVariable = () => {};

type ExportVariablesArgs = {
  tokens: string[];
  input: string;
  newTokenValue: string;
  currentIndex: number;
};

const exportVariables = ({ tokens, input, newTokenValue, currentIndex }: ExportVariablesArgs) => {
  if (newTokenValue !== "{") {
    return { updatedIndex: currentIndex, newTokenValue };
  }

  const followup = spaceCallback({ input, currentIndex });

  let variable = singleVariable({
    tokens,
    input,
    newTokenValue: followup.newTokenValue,
    currentIndex: followup.updatedIndex,
  });

  while (!variable.end) {
    variable = singleVariable({
      tokens,
      input,
      newTokenValue: variable.newTokenValue,
      currentIndex: variable.updatedIndex,
    });
  }

  if (variable.newTokenValue === "}") {
    const space2 = spaceCallback({ input, currentIndex: variable.updatedIndex });
    return { updatedIndex: space2.updatedIndex, newTokenValue: space2.newTokenValue };
  }

  return { updatedIndex: variable.updatedIndex, newTokenValue: variable.newTokenValue };
};

type SingleVariableArgs = {
  tokens: string[];
  input: string;
  newTokenValue: string;
  currentIndex: number;
};

const singleVariable = ({ tokens, input, newTokenValue, currentIndex }: SingleVariableArgs) => {
  const firstChar = newTokenValue.charAt(0);
  const isIncorrectName = isntVariableName({ firstChar });

  if (isIncorrectName) {
    return { updatedIndex: currentIndex, newTokenValue, end: true };
  }

  let next1 = newTokenValue;

  if (newTokenValue === "type") {
    const next = findNextBreakpoint({ input, currentIndex });
    next1 = next.newTokenValue;
    currentIndex = next.updatedIndex;
  }

  let name = next1;

  const space1 = spaceCallback({ input, currentIndex });
  next1 = space1.newTokenValue;
  currentIndex = space1.updatedIndex;

  if (next1 === "as") {
    const space2 = spaceCallback({ input, currentIndex });
    name = space2.newTokenValue;
    const next = spaceCallback({ input, currentIndex: space2.updatedIndex });
    next1 = next.newTokenValue;
    currentIndex = next.updatedIndex;
  }

  tokens.push(name);

  if (next1 === ",") {
    const next = spaceCallback({ input, currentIndex });
    next1 = next.newTokenValue;
    currentIndex = next.updatedIndex;

    return { updatedIndex: currentIndex, newTokenValue: next1, end: false };
  }

  return { updatedIndex: currentIndex, newTokenValue: next1, end: true };
};
