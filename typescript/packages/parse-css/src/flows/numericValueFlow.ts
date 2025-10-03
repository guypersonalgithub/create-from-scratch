import { isNumeric } from "@packages/utils";
import { TokenTypes } from "../constants";
import type { Callback } from "../types";
import { findNextBreakpoint } from "../utils";

const newTokenValues = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
const units = new Set([
  // Absolute lengths
  "cm",
  "mm",
  "Q",
  "in",
  "pc",
  "pt",
  "px",

  // Relative lengths
  "em",
  "ex",
  "ch",
  "rem",
  "lh",
  "rlh",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "vb",
  "vi",
  "svw",
  "svh",
  "svmin",
  "svmax",
  "svb",
  "svi",
  "lvw",
  "lvh",
  "lvmin",
  "lvmax",
  "lvb",
  "lvi",
  "dvw",
  "dvh",
  "dvmin",
  "dvmax",
  "dvb",
  "dvi",

  // Angle
  "deg",
  "grad",
  "rad",
  "turn",

  // Time
  "s",
  "ms",

  // Frequency
  "Hz",
  "kHz",

  // Resolution
  "dpi",
  "dpcm",
  "dppx",

  // Flex/grid
  "fr",

  // Percentage
  "%",
]);

type NumericValueFlowArgs = Callback & {
  startIndex?: number;
  isUnknown?: boolean;
  isNested?: boolean;
};

export const numericValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  startIndex = currentIndex - newTokenValue.length,
  extensionParsing,
  isUnknown,
  isNested,
}: NumericValueFlowArgs) => {
  if (!isNested && !newTokenValues.has(newTokenValue)) {
    return;
  }

  let endIndex = currentIndex;
  let value = newTokenValue;

  const type = isUnknown ? TokenTypes.UNKNOWN : TokenTypes.NUMERIC;

  let followup = findNextBreakpoint({ input, currentIndex });

  while (input.length > followup.updatedIndex) {
    if (!isNumeric({ str: followup.newTokenValue }) && followup.newTokenValue !== ".") {
      // TODO: Consider adding a check for a numeric value having more than one dot, even if the IDE when highlighting css still classifies that as a numeric value
      if (!units.has(followup.newTokenValue)) {
        tokens.push({
          type,
          value,
          startIndex: currentIndex - newTokenValue.length,
          endIndex,
        });

        if (!extensionParsing) {
          tokens.push({
            type: followup.newTokenValue[0] === " " ? TokenTypes.WHITESPACE : TokenTypes.UNKNOWN,
            value: followup.newTokenValue,
            startIndex: currentIndex,
            endIndex: followup.updatedIndex,
          });
        }

        return { updatedIndex: currentIndex };
      } else {
        value += followup.newTokenValue;
        endIndex = followup.updatedIndex;

        tokens.push({
          type,
          value,
          startIndex,
          endIndex,
        });

        return { updatedIndex: followup.updatedIndex };
      }
    }

    value += followup.newTokenValue;
    endIndex = followup.updatedIndex;
    followup = findNextBreakpoint({ input, currentIndex: followup.updatedIndex });
  }

  tokens.push({
    type,
    value,
    startIndex,
    endIndex,
  });

  return { updatedIndex: endIndex };
};
