import { useEffect, useRef, useState, type CSSProperties } from "react";
import { dynatic } from "@packages/dynatic-css";
import type { InteractiveCursorProperties } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";

export const InteractiveCursor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ className, style }, setStyling] = useState<{
    className?: string;
    style?: CSSProperties;
  }>({ className: undefined, style: undefined });

  useEffect(() => {
    const updateClassNamesOrStyle = (event: CustomEvent<InteractiveCursorProperties>) => {
      const { className, style } = event.detail;
      setStyling({ className, style });
    };

    window.addEventListener("updateClassNamesOrStyle", updateClassNamesOrStyle as EventListener);

    return () =>
      window.removeEventListener(
        "updateClassNamesOrStyle",
        updateClassNamesOrStyle as EventListener,
      );
  }, []);

  useEffect(() => {
    const mouse = ref.current;
    if (!mouse) {
      return;
    }

    const boundingRect = mouse.getBoundingClientRect();
    const { height, width } = boundingRect;

    const move = (e: MouseEvent) => {
      mouse.style.transform = `translateX(${e.clientX - width / 2}px) translateY(${e.clientY - height / 2}px)`;
    };
    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [className, style]);

  useEffect(() => {
    const mouse = ref.current;
    if (!mouse) {
      return;
    }

    const move = () => {
      mouse.style.visibility = "visible";
    };

    window.addEventListener("mousemove", move, { once: true });

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className={combineStringsWithSpaces(
        // initially hidden the mouse until it starts moving in order to know the initial position of the mouse.
        dynatic`
          position: fixed;
          width: 30px;
          height: 30px;
          top: 0;
          left: 0;
          border-radius: 50%;
          pointer-events: none;
          transform: translate3d(0, 0, 0);
          background-color: rgba(255, 0, 150, 0.5);
          transition: width 0.2s, height 0.2s, background-color 0.2s;
          z-index: 9999;
          mix-blend-mode: difference;
          visibility: hidden;
        `,
        className,
      )}
      style={style}
    />
  );
};
