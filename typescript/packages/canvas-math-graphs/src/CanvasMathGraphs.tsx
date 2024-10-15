import { useRef } from 'react';
import './canvas.css';

type CanvasMathGraphsProps = {
    height: number;
    width: number;
}

export const CanvasMathGraphs = ({ height, width }: CanvasMathGraphsProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasUpperLayerRef = useRef<HTMLCanvasElement>(null); // The idea behind a second layer is for the sake of animation optimization.

    return (
        <div className='canvasContainer'>
            <canvas className='canvas' height={height} width={width} ref={canvasRef} />
            <canvas className='canvas' height={height} width={width} ref={canvasUpperLayerRef} />
        </div>
    );
}