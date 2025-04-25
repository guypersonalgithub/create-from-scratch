import { ReactNode, RefObject } from "react";
import { Anchor } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

type RegisterRefArgs = {
  refs: RefObject<Anchor[]>;
  ref: HTMLElement | null;
  content: ReactNode;
  id?: string;
};

export const registerRef = ({ refs, ref, content, id }: RegisterRefArgs) => {
  if (!ref) {
    return;
  }

  if (!refs.current.find((r) => r.ref === ref)) {
    const elementId = id ?? generateSecureRandomString();
    ref.setAttribute("anchor-id", elementId);
    refs.current.push({ ref: ref, content, id: elementId });
  }
};

type RegisterAnchorRefArgs = {
  refs: RefObject<HTMLElement[]>;
  ref: HTMLElement | null;
};

export const registerAnchorRef = ({ refs, ref }: RegisterAnchorRefArgs) => {
  if (!ref) {
    return;
  }

  if (!refs.current.find((r) => r === ref)) {
    refs.current.push(ref);
  }
};
