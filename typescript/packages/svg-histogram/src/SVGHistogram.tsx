type SVGHistogramProps = {
  data: number[];
  width?: number;
  height?: number;
  barColor?: string;
  gap?: number;
};

export const SVGHistogram = ({
  data,
  width = 200,
  height = 100,
  barColor = "#ff3b3b",
  gap = 2,
}: SVGHistogramProps) => {
  const max = Math.max(...data);
  const barWidth = (width - gap * (data.length - 1)) / data.length;

  return (
    <svg width={width} height={height}>
      {data.map((value, index) => {
        const barHeight = (value / max) * height;

        return (
          <rect
            key={index}
            x={index * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            fill={barColor}
          />
        );
      })}
    </svg>
  );
};
