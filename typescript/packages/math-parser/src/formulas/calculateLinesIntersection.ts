import { tokenizer } from "../tokenizer";

type CalculateLinesIntersectionArgs = {
  line1: string;
  line2: string;
};

export const calculateLinesIntersection = ({ line1, line2 }: CalculateLinesIntersectionArgs) => {
  const { tokens: line1Tokens } = tokenizer({ input: line1 });
  const { tokens: line2Tokens } = tokenizer({ input: line2 });

  console.log({ line1Tokens, line2Tokens });
};
