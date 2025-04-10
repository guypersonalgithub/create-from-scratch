import { useState } from "react";
import { SyntaxHighlighter } from "@packages/syntax-highlighter";

export const Example = () => {
  const [code, setCode] = useState("");

  return (
    <div>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <SyntaxHighlighter code={""} highlightCode language="yaml" />
    </div>
  );
};
