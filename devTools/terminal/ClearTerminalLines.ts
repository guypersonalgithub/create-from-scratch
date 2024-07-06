import readline from "readline";

type ClearTerminalLinesArgs = {
  amountOfLines: number;
  skipInitialCursorMovement?: boolean;
};

export const clearTerminalLines = ({
  amountOfLines,
  skipInitialCursorMovement,
}: ClearTerminalLinesArgs) => {
  if (!skipInitialCursorMovement) {
    readline.cursorTo(process.stdout, 0);
    readline.moveCursor(process.stdout, 0, -amountOfLines);
  }

  for (let i = 0; i < amountOfLines; i++) {
    readline.clearLine(process.stdout, 0);
    readline.moveCursor(process.stdout, 0, 1);
  }

  readline.cursorTo(process.stdout, 0);
  readline.moveCursor(process.stdout, 0, -amountOfLines);
};

type ClearTerminalLineArgs = {
  amountOfLinesFromBottom: number;
  amountOfLines: number;
};

export const clearTerminalLine = ({
  amountOfLinesFromBottom,
  amountOfLines,
}: ClearTerminalLineArgs) => {
  readline.moveCursor(process.stdout, 0, -amountOfLinesFromBottom);
  clearTerminalLines({ amountOfLines, skipInitialCursorMovement: true });

  // readline.cursorTo(process.stdout, 0);
  // readline.clearLine(process.stdout, 0);

  // // Move cursor back to the original position
  // readline.cursorTo(process.stdout, 0);
  // readline.moveCursor(process.stdout, 0, amountOfLinesFromBottom);
};
