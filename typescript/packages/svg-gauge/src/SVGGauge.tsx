type SVGGaugeProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
};

export const SVGGauge = ({
  value,
  size = 100,
  strokeWidth = 10,
  color = "#ff3b3b",
//   bgColor = "#222",
}: SVGGaugeProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;

  const angle = Math.min(Math.max(value, 0), 100) / 100; // 0-1
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - angle);

  return (
    <svg width={size} height={size / 2}>
      {/* <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={0}
        strokeLinecap="round"
      /> */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-180 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};