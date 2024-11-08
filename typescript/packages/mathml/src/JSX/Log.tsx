import { ParsedToken } from "../utils";
import { RecursiveMathMLToken } from "./RecursiveMathMLToken";

type LogProps = {
  func: ParsedToken;
  base: ParsedToken[];
  value: ParsedToken[];
};

export const Log = ({ func, base, value }: LogProps) => {
  return (
    <>
      <msub>
        <RecursiveMathMLToken token={func} />
        {base.map((parsedToken, index) => {
          const { type } = parsedToken;
          const key = `${type}-${index}`;

          return <RecursiveMathMLToken key={key} token={parsedToken} />;
        })}
      </msub>
      {value.map((parsedToken, index) => {
        const { type } = parsedToken;
        const key = `${type}-${index}`;

        return <RecursiveMathMLToken key={key} token={parsedToken} />;
      })}
    </>
  );
};
