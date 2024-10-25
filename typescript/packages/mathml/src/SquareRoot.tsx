import { RecursiveMathMLToken } from "./RecursiveMathMLToken";
import { ParsedToken } from "./utils"

type SquareRootProps = {
    value: ParsedToken[];
}

export const SquareRoot = ({ value }: SquareRootProps) => {
    return (
        <msqrt>
            {value.map((parsedToken, index) => {
                const { type } = parsedToken;
                const key = `${type}-${index}`;

                return <RecursiveMathMLToken key={key} token={parsedToken} />
            })}
        </msqrt>
    )
}