type CalculateQuadraticEquationArgs = {
  a: number;
  b: number;
  c: number;
};

export const calculateQuadraticEquation = ({ a, b, c }: CalculateQuadraticEquationArgs) => {
  const root = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
  const denominator = 2 * a;
  const x1 = (-b + root) / denominator;
  const x2 = (-b - root) / denominator;

  return { x1, x2 };
};
