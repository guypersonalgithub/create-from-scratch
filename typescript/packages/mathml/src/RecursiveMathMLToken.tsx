import { Fraction } from "./Fraction";
import { Power } from "./Power";
import { SquareRoot } from "./SquareRoot";
import { FracionToken, ParsedToken, PowerToken, TokenGroup } from "./utils"

type RecursiveMathMLTokenProps = {
    token: ParsedToken;
}

export const RecursiveMathMLToken = ({ token }: RecursiveMathMLTokenProps) => {
    const { type, value } = token;

    if (type === "value") {
        return <mn>{value as string}</mn>
    } else if (type === "variable") {
        return <mi>{value as string}</mi>
    } else if (type === "uniqueToken" || type === "keyword") {
        return <mo>{value as string}</mo>
    } else if (type === "power") {
        const { base, power } = value as PowerToken['value'];
        return <Power base={base} power={power} />
    } else if (type === "fraction") {
        const { numerator, denominator } = value as FracionToken['value'];
        return <Fraction numerator={numerator} denominator={denominator} />
    } else if (type === "sqrt") {
        return <SquareRoot value={value as TokenGroup['value']} />
    }

    return null;
}