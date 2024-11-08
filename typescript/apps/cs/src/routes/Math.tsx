import { MathML } from "@packages/mathml";
import { useState } from "react";

export const Math = () => {
  const [test, setTest] = useState(
    "12 + (5 + 3 * 2) ^ 4 + (1 * 2 + 3 ^ (5sqrt(4)) + 7sin4) / (a + b (1 / 2 + 3) * 6) * 5 + 4 * 2 - sqrt(5 - 2 + ab) - 3",
  );

  return (
    <>
      <input type="string" value={test} onChange={(e) => setTest(e.target.value)} />
      <MathML input={test} format="HTML" />
    </>
  );
};
