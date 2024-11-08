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
export const uniqueFunctions = [...trigonometricFunctions, ...hyperbolicFunctions, "ln"];
export const uniqueWords = [...uniqueFunctions, "sqrt", "log"];
export const starterTokens = ["(", "-", "|"];
export const nonStarterTokens = ["+", "*", "/", "^"];
