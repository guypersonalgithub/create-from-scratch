import { Fraction } from "./Fraction";
import { Power } from "./Power";
import { SquareRoot } from "./SquareRoot";
import { UniqueFunction } from "./UniqueFunction";
import { FracionToken, LogToken, ParsedToken, PowerToken, TokenGroup } from "../utils";
import { UniqueMathMLTokens } from "../utils/parseTokensOld/constants";
import { TokenTypes } from "@packages/math-parser";
import { Factorial } from "./Factorial";
import { Log } from "./Log";

type RecursiveMathMLTokenProps = {
  token: ParsedToken;
};

export const RecursiveMathMLToken = ({ token }: RecursiveMathMLTokenProps) => {
  const { type, value } = token;

  if (type === TokenTypes.VALUE) {
    return <mn>{value as string}</mn>;
  } else if (type === TokenTypes.VARIABLE) {
    return <mi>{value as string}</mi>;
  } else if (type === TokenTypes.UNIQUE_TOKEN || type === TokenTypes.KEYWORD) {
    return <mo>{value as string}</mo>;
  } else if (type === UniqueMathMLTokens.POWER) {
    const { base, power } = value as PowerToken["value"];
    return <Power base={base} power={power} />;
  } else if (type === UniqueMathMLTokens.FRACTION) {
    const { numerator, denominator } = value as FracionToken["value"];
    return <Fraction numerator={numerator} denominator={denominator} />;
  } else if (type === UniqueMathMLTokens.SQRT) {
    return <SquareRoot value={value as TokenGroup["value"]} />;
  } else if (type === UniqueMathMLTokens.UNIQUE_FUNCTION) {
    const [func, ...funcValue] = value as TokenGroup["value"];
    return <UniqueFunction func={func} value={funcValue ?? []} />;
  } else if (type === UniqueMathMLTokens.FACTORIAL) {
    return <Factorial value={value as TokenGroup["value"]} />;
  } else if (type === UniqueMathMLTokens.LOG) {
    const { func, base, value: logValue } = value as LogToken["value"];
    return <Log func={func} base={base} value={logValue} />;
  }

  return null;
};
