import { type RefObject } from "react";

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
