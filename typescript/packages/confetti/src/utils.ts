import { convertDegreeToRadians } from "@packages/math";

type CalculateAxesVelocityArgs = {
  spread: number;
  baseAngle?: number;
};

export const calculateAxesVelocity = ({
  spread,
  baseAngle = -90, // shoot upward by default
}: CalculateAxesVelocityArgs) => {
  const angle = baseAngle + (Math.random() - 0.5) * spread; // +- spread/2
  const speed = 2 + Math.random() * 6;
  const velocityX = calculateAxisVelocity({ axis: "x", angle, speed });
  const velocityY = calculateAxisVelocity({ axis: "y", angle, speed });

  return { velocityX, velocityY };
};

type CalculateAxisVelocityArgs = {
  axis: "x" | "y";
  angle: number;
  speed: number;
};

const calculateAxisVelocity = ({ axis, angle, speed }: CalculateAxisVelocityArgs) => {
  const mathOperation = axis === "x" ? Math.cos : Math.sin;
  return (
    mathOperation(convertDegreeToRadians({ degree: angle })) * speed * (0.6 + Math.random() * 0.8)
  );
};
