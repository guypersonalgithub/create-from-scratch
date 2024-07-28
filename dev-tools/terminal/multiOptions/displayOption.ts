import {
  TerminalTextColors,
  resetTerminalAttributes,
  setTerminalTextColors,
} from "../terminalAttributes";
import { Option } from "./types";

type DisplayOptionArgs = {
  option: Option;
  selectedOptions: Option[];
  cursorIndex: number;
  index: number;
  isMultiSelect?: boolean;
};

export const displayOption = ({
  option,
  selectedOptions,
  cursorIndex,
  index,
  isMultiSelect,
}: DisplayOptionArgs) => {
  const isSelected = selectedOptions.includes(option);
  const isCursor = cursorIndex === index;
  if (isCursor) {
    setTerminalTextColors({ textColor: TerminalTextColors.Yellow });
  }

  const optionText = getOptionText({
    option,
    isCursor,
    isSelected,
    isMultiSelect,
  });
  console.log(optionText);
  resetTerminalAttributes();

  return optionText;
};

type GetOptionTextArgs = {
  option: Option;
  isCursor: boolean;
  isSelected: boolean;
  isMultiSelect?: boolean;
};

const getOptionText = ({
  option,
  isCursor,
  isSelected,
  isMultiSelect,
}: GetOptionTextArgs) => {
  const cursor = isCursor ? " >" : "  ";
  const label = option.label;

  if (!isMultiSelect) {
    return `${cursor} ${label}`;
  }

  const selected = isSelected ? "[x]" : "[ ]";

  return `${cursor} ${selected} ${label}`;
};
