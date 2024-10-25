import { tokenizer } from "@packages/math-parser";
import { parseTokens } from "./utils";
import { RecursiveMathMLToken } from "./RecursiveMathMLToken";

type MathMLProps = {
    input: string;
}

export const MathML = ({ input }: MathMLProps) => {
    const tokens = tokenizer({ input });
    const { parsedTokens } = parseTokens({ tokens });

    return (<math>
        <mrow>
            {parsedTokens.map((parsedToken, index) => {
                const { type } = parsedToken;
                const key = `${type}-${index}`;

                return <RecursiveMathMLToken key={key} token={parsedToken} />
            })}
        </mrow>
    </math>);
}