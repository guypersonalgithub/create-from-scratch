type GetNextNonSpaceCharIndexArgs = {
    input: string;
  };
  
  export const getNextNonSpaceCharIndex = ({ input }: GetNextNonSpaceCharIndexArgs) => {
    let skippedIndexes = 0;
  
    while (skippedIndexes < input.length && input[skippedIndexes] === " ") {
      skippedIndexes++;
    }
  
    if (skippedIndexes === input.length) {
      return {};
    }
  
    return {
      skippedIndexes,
    };
  };
