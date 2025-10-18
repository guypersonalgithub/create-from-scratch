import type { Callback } from "./types";
import { spaceCallback } from "./utils";

export const constantFlow = ({ input, currentIndex, exports }: Omit<Callback, "newTokenValue">) => {
  let followup = spaceCallback({ input, currentIndex });
};
