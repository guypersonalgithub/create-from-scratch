import { RecursiveMathMLToken } from "./RecursiveMathMLToken";
import { ParsedToken } from "./utils";

type PowerArgs = {
    base: ParsedToken[];
    power: ParsedToken[];
}

export const Power = ({ base, power }: PowerArgs) => {
    return (<msup>
        <mrow>
            {base.map((parsedToken, index) => {
                const { type } = parsedToken;
                const key = `${type}-${index}`;

                return <RecursiveMathMLToken key={key} token={parsedToken} />
            })}
        </mrow>
        <mrow>
            {power.map((parsedToken, index) => {
                const { type } = parsedToken;
                const key = `${type}-${index}`;

                return <RecursiveMathMLToken key={key} token={parsedToken} />
            })}
        </mrow>
    </msup>);
}