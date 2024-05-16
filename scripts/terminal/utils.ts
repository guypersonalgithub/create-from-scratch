export const hideTerminalCursor = () => {
  process.stdout.write("\x1B[?25l");
};

export const revealTerminalCursor = () => {
  process.stdout.write("\x1B[?25h");
};
