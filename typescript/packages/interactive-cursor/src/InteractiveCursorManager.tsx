import { useEffect, useState } from "react";
import { InteractiveCursor } from "./InteractiveCursor";

type InteractiveCursorManagerProps = {
  initiallyEnabled?: boolean;
};

export const InteractiveCursorManager = ({ initiallyEnabled = false }: InteractiveCursorManagerProps) => {
  const [enabled, setEnabled] = useState(initiallyEnabled);

  useEffect(() => {
    const enableInteractiveCursor = () => setEnabled(true);
    const disableInteractiveCursor = () => setEnabled(false);

    window.addEventListener("enableInteractiveCursor", enableInteractiveCursor as EventListener);
    window.addEventListener("disableInteractiveCursor", disableInteractiveCursor as EventListener);

    return () => {
      window.removeEventListener(
        "enableInteractiveCursor",
        enableInteractiveCursor as EventListener,
      );
      window.removeEventListener(
        "disableInteractiveCursor",
        disableInteractiveCursor as EventListener,
      );
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <InteractiveCursor />
};
