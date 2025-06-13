import { TokenTypes } from "@packages/math-parser";
import { type ParsedToken } from "../utils/parseTokens/types";
import { RecursiveMathMLToken } from "./RecursiveMathMLToken";

type LimitProps = {
  lim: ParsedToken;
  arrow: ParsedToken;
  variables: ParsedToken[];
  values: ParsedToken[][];
};

export const Limit = ({ lim, arrow, variables, values }: LimitProps) => {
  return (
    <msub>
      <RecursiveMathMLToken token={lim} />
      <mrow>
        {variables.map((parsedToken, index) => {
          const { type } = parsedToken;
          const key = `${type}-${index}`;

          return <RecursiveMathMLToken key={key} token={parsedToken} />;
        })}
        <RecursiveMathMLToken token={arrow} />
        {values.map((parsedTokens, index) => {
          const lastToken = parsedTokens[parsedTokens.length - 1];
          const hasDirection = lastToken.type === TokenTypes.LIMIT_DIRECTION;
          const value = hasDirection
            ? parsedTokens.slice(0, parsedTokens.length - 1)
            : parsedTokens;
          const key = `value-${index}`;

          return (
            <msup key={key}>
              <mrow>
                {value.map((parsedToken, index) => {
                  const { type } = parsedToken;
                  const key = `${type}-${index}`;

                  return <RecursiveMathMLToken key={key} token={parsedToken} />;
                })}
              </mrow>
              {hasDirection ? <RecursiveMathMLToken key={key} token={lastToken} /> : null}
            </msup>
          );
        })}
      </mrow>
    </msub>
  );
};
