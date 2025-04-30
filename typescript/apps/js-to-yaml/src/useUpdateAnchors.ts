import { useRegisterAnchors } from "@packages/scrollspy-anchors";
import { useEffect } from "react";
import { stateUpdates } from "./StateManagement";

export const useUpdateAnchors = () => {
  const { anchors, registerRef } = useRegisterAnchors();

  useEffect(() => {
    stateUpdates.updateAnchors(anchors);

    return () => {
      stateUpdates.updateAnchors([]);
    };
  }, []);

  return { registerRef };
};
