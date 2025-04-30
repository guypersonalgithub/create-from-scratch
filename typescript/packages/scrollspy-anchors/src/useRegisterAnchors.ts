import { ReactNode, useRef } from "react";
import { Anchor } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useRegisterAnchors = () => {
  const refs = useRef<Anchor[]>([]);

  type RegisterRefArgs = {
    ref: HTMLElement | null;
    content: ReactNode;
    id?: string;
  };

  const registerRef = ({ ref, content, id }: RegisterRefArgs) => {
    if (!ref) {
      return;
    }

    if (!refs.current.find((r) => r.ref === ref)) {
      const elementId = id ?? generateSecureRandomString();
      ref.setAttribute("anchor-id", elementId);
      refs.current.push({ ref: ref, content, id: elementId });
    }
  };

  return {
    anchors: refs.current,
    registerRef,
  };
};
