type TreeMapNode = {
  label: string;
  value: number;
  color?: string;
};

type SVGTreeMapProps = {
  data: TreeMapNode[];
  width?: number;
  height?: number;
};

export const SVGTreeMap = ({ data, width = 200, height = 100 }: SVGTreeMapProps) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let x = 0;

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const w = (d.value / total) * width;
        const rect = (
          <rect
            key={i}
            x={x}
            y={0}
            width={w}
            height={height}
            fill={d.color || "#ff3b3b"}
            stroke="#111"
          />
        );

        const text = (
          <text
            key={"text" + i}
            x={x + w / 2}
            y={height / 2}
            fill="#fff"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={12}
          >
            {d.label}
          </text>
        );
        x += w;

        return [rect, text];
      })}
    </svg>
  );
};
