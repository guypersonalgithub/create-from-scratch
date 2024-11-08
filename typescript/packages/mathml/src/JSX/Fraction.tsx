import { ParsedToken } from "../utils";
import { RecursiveMathMLToken } from "./RecursiveMathMLToken";

type FractionArgs = {
  numerator: ParsedToken[];
  denominator: ParsedToken[];
};

export const Fraction = ({ numerator, denominator }: FractionArgs) => {
  return (
    <mfrac>
      <mrow>
        {numerator.map((parsedToken, index) => {
          const { type } = parsedToken;
          const key = `${type}-${index}`;

          return <RecursiveMathMLToken key={key} token={parsedToken} />;
        })}
      </mrow>
      <mrow>
        {denominator.map((parsedToken, index) => {
          const { type } = parsedToken;
          const key = `${type}-${index}`;

          return <RecursiveMathMLToken key={key} token={parsedToken} />;
        })}
      </mrow>
    </mfrac>
  );
};
