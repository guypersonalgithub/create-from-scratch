export const basicOperators = new Set(["+", "-", "*", "/"]);
export const nonConsecutiveOperators = new Set([...basicOperators, "^", "!", ")", "|", "="])
export const operators = new Set<string>(["+", "-", "*", "/", "^"]);
export const uniqueTokens = new Set<string>([...operators, "(", ")", "=", "|", "!"]);
export const trigonometricFunctions = new Set<string>([
  "sin",
  "cos",
  "tan",
  "csc",
  "sec",
  "cot",
  "arcsin",
  "arccos",
  "arctan",
  "arccsc",
  "arcsec",
  "arccot",
]);
export const hyperbolicFunctions = new Set<string>([
  "sinh",
  "cosh",
  "tanh",
  "csch",
  "sech",
  "coth",
  "arcsinh",
  "arccosh",
  "arctanh",
  "arccsch",
  "arcsech",
  "arccoth",
]);
export const uniqueFunctions = new Set([...trigonometricFunctions, ...hyperbolicFunctions, "ln"]);
export const uniqueWords = new Set([...uniqueFunctions, "sqrt", "log"]);
export const nonStarterTokens = new Set(["+", "*", "/", "^", ")"]);
