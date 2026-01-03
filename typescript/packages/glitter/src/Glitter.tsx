import { useLayoutEffect, useEffect, useRef, type ReactNode } from "react";
import { dynatic } from "@packages/dynatic-css";
import { scaleCanvasByDevicePixelRatio } from "@packages/canvas-utils";
import { convertDegreeToRadians } from "@packages/math";

type GlitterProps = {
  sparksCount?: number;
  children: ReactNode;
};

const glitterHeight = 6;

export const Glitter = ({ sparksCount = 5, children }: GlitterProps) => {
  const childrenContainerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const childrenContainer = childrenContainerRef.current;
    const canvas = ref.current;

    if (!childrenContainer || !canvas) {
      return;
    }

    const { width, height } = childrenContainer.getBoundingClientRect();

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const { width, height } = canvas.getBoundingClientRect();
    scaleCanvasByDevicePixelRatio({ canvas, ctx, width, height });

    ctx.fillStyle = "white";

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, width, height);

      const sparks = Array.from({ length: sparksCount }, () => ({
        x: Math.random(),
        y: Math.random(),
      }));

      sparks.forEach((spark) => {
        const sparkWidth = 2 + Math.random() * 3;
        ctx.globalAlpha = 0.5 + Math.random() * 0.5;
        const skewDeg = Math.random() * 20 - 10;
        const angle = convertDegreeToRadians({ degree: skewDeg });
        ctx.setTransform(1, 0, Math.tan(angle), 1, 0, 0);
        const x = spark.x * width;
        const y = spark.y * height;
        ctx.fillRect(x, y, sparkWidth, glitterHeight);
        // ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      });
    }, 300);
    return () => clearInterval(interval);
  }, [sparksCount]);

  return (
    <div
      className={dynatic`
        display: grid;
      `}
    >
      <div
        ref={childrenContainerRef}
        className={dynatic`
          grid-area: 1 / 1;
          height: fit-content;
        `}
      >
        {children}
      </div>
      <canvas
        ref={ref}
        className={dynatic`
          grid-area: 1 / 1;
          z-index: 2;
          pointer-events: none;
        `}
      />
    </div>
  );
};
