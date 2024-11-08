import { RecursiveMathMLToken } from "./RecursiveMathMLToken";
import { ParsedToken } from "../utils";

type UniqueFunctionProps = {
  func: ParsedToken;
  value: ParsedToken[];
};

export const UniqueFunction = ({ func, value }: UniqueFunctionProps) => {
  return (
    <mrow>
      <RecursiveMathMLToken token={func} />
      {value.map((parsedToken, index) => {
        const { type } = parsedToken;
        const key = `${type}-${index}`;

        return <RecursiveMathMLToken key={key} token={parsedToken} />;
      })}
    </mrow>
  );
};
