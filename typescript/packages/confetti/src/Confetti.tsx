import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { useRef, useEffect, type CSSProperties } from "react";
import { calculateAxesVelocity } from "./utils";

type ConfettiParticle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  size: number;
  color: string;
  rotation: number;
  angularVelocity: number;
  life: number; // time left in frames or normalized
  tilt: number;
};

type ConfettiProps = {
  className?: string;
  style?: CSSProperties;
  x: number;
  y: number;
  particleCount?: number; // how many pieces per burst
  spread?: number; // angle spread in degrees
  size?: number; // rough particle size
  gravity?: number; // acceleration
  colors?: string[];
  baseAngle?: number;
  removeConfetti: () => void;
};

export const Confetti = ({
  className = dynatic`
    width: 100vw;
    height: 100vh;
  `,
  style,
  x,
  y,
  particleCount = 80,
  spread = 60,
  size = 7,
  gravity = 0.35,
  colors = ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"],
  baseAngle,
  removeConfetti,
}: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Resize canvas to device pixel ratio
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const spawn = (x: number, y: number, count = particleCount) => {
    for (let i = 0; i < count; i++) {
      const { velocityX, velocityY } = calculateAxesVelocity({ spread, baseAngle });
      particlesRef.current.push({
        x,
        y,
        velocityX,
        velocityY,
        size: size * (0.6 + Math.random() * 1.4),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.3,
        life: 60 + Math.random() * 40, // frames
        tilt: Math.random() * 0.5,
      });
    }

    // start animation loop if not already
    if (!rafRef.current) {
      animate();
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const particles = particlesRef.current;

    const step = () => {
      if (!mountedRef.current) {
        return;
      }

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        // physics
        p.velocityY += gravity; // gravity
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.rotation += p.angularVelocity;
        p.life -= 1;

        // simple air drag
        p.velocityX *= 0.99;
        p.velocityY *= 0.99;

        // draw as rotated rectangle (paper confetti)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // tilt effect using scaleY
        const tiltScale = Math.cos(p.rotation) * 0.7 + 0.3;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, (-p.size / 2) * tiltScale, p.size, p.size * tiltScale);
        ctx.restore();

        // remove if off-screen or life ended
        if (
          p.life <= 0 ||
          p.y - p.size > height + 50 ||
          p.x + p.size < -50 ||
          p.x - p.size > width + 50
        ) {
          particles.splice(i, 1);
        }
      }

      // keep looping if we still have particles
      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        // clear once more to remove remnants
        ctx.clearRect(0, 0, width, height);
        removeConfetti();
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    // If desired to attach the confetti to an element instead of giving the ability to dictate x/y from the outside.
    // const element = ref.current;
    // const rect = element.getBoundingClientRect();
    // const x = rect.left + rect.width / 2 - (element.parentElement?.getBoundingClientRect().left || 0);
    // const y = rect.top + rect.height / 2 - (element.parentElement?.getBoundingClientRect().top || 0);

    spawn(x, y);
  }, [x, y]);

  return (
    <canvas
      ref={canvasRef}
      className={combineStringsWithSpaces(
        dynatic`
          border: 3px solid red;
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
        `,
        className,
      )}
      style={style}
    />
  );
};
