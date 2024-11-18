import { MathML, unicodes } from "@packages/mathml";
import { Link } from "@packages/router";
import { useState } from "react";
import { CopyToClipboardWithTooltip } from "@packages/copy-to-clipboard";

const printableUnicodes = Object.values(unicodes.javascript).map((unicode) => unicode);

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
      <div>
        <h3>Helper unicodes:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "20px" }}>
          {printableUnicodes.map((unicode) => (
            <CopyToClipboardWithTooltip key={unicode} textToCopy={unicode}>
              {unicode}
            </CopyToClipboardWithTooltip>
          ))}
        </div>
      </div>
      <input type="string" value={input} onChange={(e) => setInput(e.target.value)} />
      <MathML input={input} format="HTML" />
    </>
  );
};
