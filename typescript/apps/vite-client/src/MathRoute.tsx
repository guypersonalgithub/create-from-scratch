import { MathML } from "@packages/mathml";
import { CanvasMathGraph } from "@packages/canvas-math-graph";

export const MathRoute = () => {
  return (
    <div>
      <MathML
        input="12 + (5 + 3 * 2) ^ 4 + (1 * 2 + 3 ^ (5sqrt(4)) + 7sin4) / (a + b (1 / 2 + 3) * 6) * 5 + 4 * 2 - sqrt(5 - 2 + ab) - 3"
        format="HTML"
      />
      <CanvasMathGraph height={800} width={800} />
    </div>
  );
};
