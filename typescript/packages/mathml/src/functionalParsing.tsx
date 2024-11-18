import { TokenTypes } from "@packages/math-parser";
import {
  FracionToken,
  LimitToken,
  LogToken,
  ParsedToken,
  PowerToken,
  TokenGroup,
} from "./utils/parseTokens/types";
import { UniqueMathMLTokens } from "./utils/parseTokens/constants";

type FunctionalParsingArgs = {
  parsedTokens: ParsedToken[];
};

export const functionalParsing = ({ parsedTokens }: FunctionalParsingArgs): string => {
  return `<math>
      <mrow>
        ${parsedTokens
          .map((parsedToken) => {
            return recursiveMathMLToken({ token: parsedToken });
          })
          .join(" ")}
      </mrow>
    </math>`;
};

type RecursiveMathMLTokenArgs = {
  token: ParsedToken;
};

const recursiveMathMLToken = ({ token }: RecursiveMathMLTokenArgs) => {
  const { type, value } = token;

  if (type === TokenTypes.VALUE) {
    return `<mn>${value as string}</mn>`;
  } else if (type === TokenTypes.VARIABLE) {
    return `<mi>${value as string}</mi>`;
  } else if (
    type === TokenTypes.UNIQUE_TOKEN ||
    type === TokenTypes.KEYWORD ||
    type === TokenTypes.LIMIT_ARROW ||
    type === TokenTypes.LIMIT_SPREAD ||
    type === TokenTypes.LIMIT_DIRECTION
  ) {
    return `<mo>${value as string}</mo>`;
  } else if (type === UniqueMathMLTokens.POWER) {
    const { base, power } = value as PowerToken["value"];
    return powerTemplate({ base, power });
  } else if (type === UniqueMathMLTokens.FRACTION) {
    const { numerator, denominator } = value as FracionToken["value"];
    return fractionTemplate({ numerator, denominator });
  } else if (type === UniqueMathMLTokens.SQRT) {
    return squareRootTemplate({ value: value as TokenGroup["value"] });
  } else if (type === UniqueMathMLTokens.UNIQUE_FUNCTION) {
    const [func, ...funcValue] = value as TokenGroup["value"];
    return uniqueFunctionTemplate({ func, value: funcValue });
  } else if (type === UniqueMathMLTokens.FACTORIAL) {
    return factorialTemplate({ value: value as TokenGroup["value"] });
  } else if (type === UniqueMathMLTokens.LOG) {
    const { func, base, value: logValue } = value as LogToken["value"];
    return logTemplate({ func, base, value: logValue });
  } else if (type === UniqueMathMLTokens.LIMIT) {
    const { lim, arrow, variables, values } = value as LimitToken["value"];
    return limitTemplate({ lim, arrow, variables, values });
  }

  return "";
};

type PowerTemplateArgs = {
  base: ParsedToken[];
  power: ParsedToken[];
};

const powerTemplate = ({ base, power }: PowerTemplateArgs): string => {
  return `<msup>
      <mrow>
        ${base
          .map((parsedToken) => {
            return recursiveMathMLToken({ token: parsedToken });
          })
          .join(" ")}
      </mrow>
      <mrow>
        ${power
          .map((parsedToken) => {
            return recursiveMathMLToken({ token: parsedToken });
          })
          .join(" ")}
      </mrow>
    </msup>`;
};

type FractionTemplateArgs = {
  numerator: ParsedToken[];
  denominator: ParsedToken[];
};

const fractionTemplate = ({ numerator, denominator }: FractionTemplateArgs): string => {
  return `<mfrac>
      <mrow>
        ${numerator
          .map((parsedToken) => {
            return recursiveMathMLToken({ token: parsedToken });
          })
          .join(" ")}
      </mrow>
      <mrow>
        ${denominator
          .map((parsedToken) => {
            return recursiveMathMLToken({ token: parsedToken });
          })
          .join(" ")}
      </mrow>
    </mfrac>`;
};

type SquareRootTemplateArgs = {
  value: ParsedToken[];
};

const squareRootTemplate = ({ value }: SquareRootTemplateArgs): string => {
  return `<msqrt>
      ${value
        .map((parsedToken) => {
          return recursiveMathMLToken({ token: parsedToken });
        })
        .join(" ")}
    </msqrt>`;
};

type UniqueFunctionTemplateArgs = {
  func: ParsedToken;
  value: ParsedToken[];
};

const uniqueFunctionTemplate = ({ func, value }: UniqueFunctionTemplateArgs): string => {
  return `<mrow>
      ${recursiveMathMLToken({ token: func })}$
      ${value
        .map((parsedToken) => {
          return recursiveMathMLToken({ token: parsedToken });
        })
        .join(" ")}
    </mrow>`;
};

type FactorialTemplateArgs = {
  value: ParsedToken[];
};

const factorialTemplate = ({ value }: FactorialTemplateArgs): string => {
  return `<mrow>
      ${value
        .map((parsedToken) => {
          return recursiveMathMLToken({ token: parsedToken });
        })
        .join(" ")}
    </mrow>`;
};

type LogTemplateArgs = {
  func: ParsedToken;
  base: ParsedToken[];
  value: ParsedToken[];
};

export const logTemplate = ({ func, base, value }: LogTemplateArgs): string => {
  return `<msub>
        ${recursiveMathMLToken({ token: func })}
        ${base
          .map((parsedToken) => {
            return recursiveMathMLToken({ token: parsedToken });
          })
          .join(" ")}
      </msub>
      ${value
        .map((parsedToken) => {
          return recursiveMathMLToken({ token: parsedToken });
        })
        .join(" ")}`;
};

type LimitTemplateProps = {
  lim: ParsedToken;
  arrow: ParsedToken;
  variables: ParsedToken[];
  values: ParsedToken[][];
};

export const limitTemplate = ({ lim, arrow, variables, values }: LimitTemplateProps): string => {
  return `<msub>
        ${recursiveMathMLToken({ token: lim })}
      <mrow>
        ${variables
          .map((parsedToken) => {
            return recursiveMathMLToken({ token: parsedToken });
          })
          .join(" ")}
        ${recursiveMathMLToken({ token: arrow })}
        ${values.map((parsedTokens) => {
          const lastToken = parsedTokens[parsedTokens.length - 1];
          const hasDirection = lastToken.type === TokenTypes.LIMIT_DIRECTION;
          const value = hasDirection
            ? parsedTokens.slice(0, parsedTokens.length - 1)
            : parsedTokens;

          return `<msup>
            <mrow>
              ${value.map((parsedToken) => {
                return recursiveMathMLToken({ token: parsedToken });
              })}
            </mrow>
            ${hasDirection ? recursiveMathMLToken({ token: lastToken }) : ""}
          </msup>`;
        })}
      </mrow>
    </msub>`;
};
