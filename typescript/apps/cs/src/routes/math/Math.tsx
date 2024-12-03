import { MathML, unicodes } from "@packages/mathml";
import { useState } from "react";
import { CopyToClipboardWithTooltip } from "@packages/copy-to-clipboard";
import { StyledLink } from "../../styledComponents/StyledLink";

const printableUnicodes = Object.values(unicodes.javascript).map((unicode) => unicode);

export const Math = () => {
  const [input, setInput] = useState(
    "12 + (5 + 3 * 2) ^ 4 + (1 * 2 + 3 ^ (5sqrt(4)) + 7sin4) / (a + b (1 / 2 + 3) * 6) * 5 + 4 * 2 - sqrt(5 - 2 + ab) - 3",
  );

  return (
    <>
      <div style={{ display: "flex", gap: "5px" }}>
        <StyledLink pathname="/math/calculus">Calculus</StyledLink>
        <StyledLink pathname="/math/floor-function">Floor function</StyledLink>
        <StyledLink pathname="/math/tangent-line">Tangent line</StyledLink>
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
      <MathML input={input} isAnExpression />
    </>
  );
};
