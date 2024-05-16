export enum TerminalTextColors {
  Black = "\x1b[30m",
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",
}

type SetTerminalTextColorsArgs = {
  textColor: TerminalTextColors;
};

export const setTerminalTextColors = ({
  textColor,
}: SetTerminalTextColorsArgs) => {
  process.stdout.write(textColor);
};

export enum TerminalBackgroundColors {
  Black = "\x1b[40m",
  Red = "\x1b[41m",
  Green = "\x1b[42m",
  Yellow = "\x1b[43m",
  Blue = "\x1b[44m",
  Magenta = "\x1b[45m",
  Cyan = "\x1b[46m",
  White = "\x1b[47m",
}

type SetTerminalBackgroundColorsArgs = {
  backgroundColor: TerminalBackgroundColors;
};

export const setTerminalBackgroundColors = ({
  backgroundColor,
}: SetTerminalBackgroundColorsArgs) => {
  process.stdout.write(backgroundColor);
};

export const resetTerminalAttributes = () => {
  process.stdout.write("\x1b[0m");
};
