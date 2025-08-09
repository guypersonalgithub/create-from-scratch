export const stringDefinitions = new Set<string>(["'", '"']);
export const valueArithmetics = new Set<string>(["+", "-", "*", "/", "^", "%"]);
export const operators = new Set<string>([".", ":", ",", ";", "=", "!", "?", ...valueArithmetics]);
export const breakpoints = new Set<string>([
  " ",
  "{",
  "}",
  "(",
  ")",
  "`",
  "&",
  "|",
  "\n",
  "<",
  ">",
  "[",
  "]",
  ...operators,
  ...stringDefinitions,
]);
