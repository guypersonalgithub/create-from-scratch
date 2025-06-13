import { RecursiveMathMLToken } from "./RecursiveMathMLToken";
import { type ParsedToken } from "../utils/parseTokens/types";

type SquareRootProps = {
  value: ParsedToken[];
};

export const SquareRoot = ({ value }: SquareRootProps) => {
  return (
    <msqrt>
      {value.map((parsedToken, index) => {
        const { type } = parsedToken;
        const key = `${type}-${index}`;

        return <RecursiveMathMLToken key={key} token={parsedToken} />;
      })}
    </msqrt>
  );
};
