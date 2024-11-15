import { MathML } from "@packages/mathml";
import { Link } from "@packages/router";
import { useState } from "react";

export const Math = () => {
  const [input, setInput] = useState(
    "12 + (5 + 3 * 2) ^ 4 + (1 * 2 + 3 ^ (5sqrt(4)) + 7sin4) / (a + b (1 / 2 + 3) * 6) * 5 + 4 * 2 - sqrt(5 - 2 + ab) - 3",
  );

  return (
    <>
      <div>
        <Link pathname="/math/calculus" style={{ color: "#5662F6" }}>
          Calculus
        </Link>
      </div>
      <input type="string" value={input} onChange={(e) => setInput(e.target.value)} />
      <MathML input={input} format="HTML" />
    </>
  );
};
