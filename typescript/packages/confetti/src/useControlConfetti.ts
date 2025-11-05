import { type ConfettiDisplayProps } from "./types";
import { generateSecureRandomString } from "@packages/randomizer";

export const useControlConfetti = () => {
  const showConfetti = ({
    className,
    style,
    x,
    y,
    particleCount,
    spread,
    size,
    gravity,
    colors,
  }: Omit<ConfettiDisplayProps, "id">) => {
    const event = new CustomEvent<ConfettiDisplayProps>("showConfetti", {
      detail: {
        id: generateSecureRandomString(),
        className,
        style,
        x,
        y,
        particleCount,
        spread,
        size,
        gravity,
        colors,
      },
    });
    window.dispatchEvent(event);
  };

  const deleteConfetti = () => {
    const event = new CustomEvent("deleteConfetti");
    window.dispatchEvent(event);
  };

  return {
    showConfetti,
    deleteConfetti,
  };
};
