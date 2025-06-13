import { type ParsedToken } from "../utils/parseTokens/types";
import { RecursiveMathMLToken } from "./RecursiveMathMLToken";

type RootProps = {
  base: ParsedToken[];
  value: ParsedToken[];
};

export const Root = ({ base, value }: RootProps) => {
  return (
    <mroot>
      <mrow>
        {base.map((parsedToken, index) => {
          const { type } = parsedToken;
          const key = `${type}-${index}`;

          return <RecursiveMathMLToken key={key} token={parsedToken} />;
        })}
      </mrow>
      <mrow>
        {value.map((parsedToken, index) => {
          const { type } = parsedToken;
          const key = `${type}-${index}`;

          return <RecursiveMathMLToken key={key} token={parsedToken} />;
        })}
      </mrow>
    </mroot>
  );
};
