type SVGSparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
};

export const SVGSparkline = ({
  data,
  width = 120,
  height = 30,
  strokeColor = "#ff3b3b",
  fillColor = "rgba(255,59,59,0.2)",
}: SVGSparklineProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height}>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={fillColor} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth={2} />
    </svg>
  );
};
