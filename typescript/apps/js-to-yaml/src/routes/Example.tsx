import { useState } from "react";
import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";

export const Example = () => {
  const [code, setCode] = useState("");

  return (
    <div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <PseudoTerminalVisuals code={""} highlightCode language="yaml" />
    </div>
  );
};
