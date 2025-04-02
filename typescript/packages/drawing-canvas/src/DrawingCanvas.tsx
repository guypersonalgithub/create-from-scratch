import { useRef, useState, useEffect, CSSProperties } from "react";

type DrawingCanvasProps = {
  style?: CSSProperties;
};

export const DrawingCanvas = ({
  style = { border: "1px solid black", cursor: "crosshair" },
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the 2D rendering context
    ctxRef.current = canvas.getContext("2d");
    if (ctxRef.current) {
      ctxRef.current.lineCap = "round";
      ctxRef.current.lineWidth = 3;
      ctxRef.current.strokeStyle = "#000"; // Black color
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;

    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctxRef.current) {
      ctxRef.current.closePath();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={style}
    />
  );
};
