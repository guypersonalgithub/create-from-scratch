import { MathML, unicodes } from "@packages/mathml";
import { useState } from "react";
import { CopyToClipboardWithTooltip } from "@packages/copy-to-clipboard";
import { Input } from "@packages/input";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { SubRouter } from "@packages/router";
import { Calculus } from "./calculus/Calculus";
import { FloorFunction } from "./FloorFunction";
import { CompositionOfFunctions } from "./CompositionOfFunctions";
import { TangentLine } from "./TangentLine";
import { SecantLine } from "./SecantLine";

const printableUnicodes = Object.values(unicodes.javascript).map((unicode) => unicode);

export const Math = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
        links={[
          { path: "/math", children: "Math" },
          { path: "/math/calculus", children: "Calculus" },
          { path: "/math/floor-function", children: "Floor function" },
          { path: "/composition-of-functions", children: "Composition Of Functions" },
          { path: "/math/tangent-line", children: "Tangent line" },
          { path: "/secant-line", children: "Secant line" },
        ]}
      />
      <SubRouter
        paths={{
          "/": () => {
            const [input, setInput] = useState(
              "12 + (5 + 3 * 2) ^ 4 + (1 * 2 + 3 ^ (5sqrt(4)) + 7sin4) / (a + b (1 / 2 + 3) * 6) * 5 + 4 * 2 - sqrt(5 - 2 + ab) - 3",
            );

            return (
              <>
                <div>
                  <StyledMainTitle>Helper unicodes:</StyledMainTitle>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "20px" }}
                  >
                    {printableUnicodes.map((unicode) => (
                      <CopyToClipboardWithTooltip key={unicode} textToCopy={unicode}>
                        {unicode}
                      </CopyToClipboardWithTooltip>
                    ))}
                  </div>
                </div>
                <Input type="string" value={input} onChange={(e) => setInput(e.target.value)} />
                <MathML input={input} isAnExpression />
              </>
            );
          },
          "/calculus!": <Calculus />,
          "/floor-function": <FloorFunction />,
          "/composition-of-functions": <CompositionOfFunctions />,
          "/tangent-line": <TangentLine />,
          "/secant-line": <SecantLine />,
        }}
      />
    </div>
  );
};
