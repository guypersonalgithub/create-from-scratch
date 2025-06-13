import { type ParsedToken } from "../utils/parseTokens/types";
import { RecursiveMathMLToken } from "./RecursiveMathMLToken";

type FloorProps = {
  value: ParsedToken[];
};

export const Floor = ({ value }: FloorProps) => {
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
