import { useEffect, useRef } from "react";

type PieChartData = {
  label: string;
  value: number;
  color: string;
};

type PieChartProps = {
  data: PieChartData[];
  width?: number;
  height?: number;
};

export const PieChart = ({ data, width = 300, height = 300 }: PieChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    let startAngle = 0;

    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Optional: label in the middle of the slice
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + (radius / 1.5) * Math.cos(midAngle);
      const labelY = centerY + (radius / 1.5) * Math.sin(midAngle);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, labelX, labelY);

      startAngle += sliceAngle;
    });
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
