import { RecursiveMathMLToken } from "./RecursiveMathMLToken";
import { ParsedToken } from "../utils/parseTokens/types";

type FactorialProps = {
  value: ParsedToken[];
};

export const Factorial = ({ value }: FactorialProps) => {
  return (
    <mrow>
      {value.map((parsedToken, index) => {
        const { type } = parsedToken;
        const key = `${type}-${index}`;

        return <RecursiveMathMLToken key={key} token={parsedToken} />;
      })}
    </mrow>
  );
};
