import { useEffect } from "react";
import { Anchor } from "./types";
import { observeElementsVisibility } from "@packages/utils";
import { Anchors } from "./Anchors";
import { useState } from "react";

type ScrollspyAnchorsProps = {
  anchors: Anchor[];
};

export const ScrollspyAnchors = ({ anchors }: ScrollspyAnchorsProps) => {
  const [anchorsLoaded, setAnchorsLoaded] = useState(false);
  const [visibleAnchors, setVisibleAnchors] = useState<string[]>([]);

  useEffect(() => {
    if (anchors.length === 0) {
      return;
    }

    const elements = anchors.map((anchor) => anchor.ref);
    setAnchorsLoaded(true);

    const observer = observeElementsVisibility({
      elements,
      intersectionCallback: ({ element }) => {
        const id = element.getAttribute("anchor-id");

        if (!id) {
          return;
        }

        setVisibleAnchors((prev) => {
          return [...prev, id];
        });
      },
      removalCallback: ({ element }) => {
        const id = element.getAttribute("anchor-id");

        if (!id) {
          return;
        }

        setVisibleAnchors((prev) => prev.filter((anchor) => anchor !== id));
      },
      threshold: [0.05]
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!anchorsLoaded) {
    return null;
  }

  return <Anchors anchors={anchors} visibleAnchors={visibleAnchors} />;
};
