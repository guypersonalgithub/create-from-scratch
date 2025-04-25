import { ScrollspyAnchors, registerRef, Anchor } from "@packages/scrollspy-anchors";
import { useRef } from "react";

export const Test2 = () => {
  const refs = useRef<Anchor[]>([]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          <div
            ref={(ref) => registerRef({ refs, ref, content: "Test" })}
            style={{ height: "100vh" }}
          >
            Test
          </div>
          <div
            ref={(ref) => registerRef({ refs, ref, content: "Test2" })}
            style={{ height: "100vh" }}
          >
            Test2
          </div>
          <div
            ref={(ref) => registerRef({ refs, ref, content: "Test3" })}
            style={{ height: "100vh" }}
          >
            Test3
          </div>
        </div>
        <div style={{ position: "sticky", top: 60, height: "fit-content" }}>
          <ScrollspyAnchors anchors={refs.current} />
        </div>
      </div>
    </div>
  );
};
