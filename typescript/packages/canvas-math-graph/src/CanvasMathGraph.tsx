import { useEffect, useRef } from 'react';
import './styles.css';
import { Graph } from './graph';

type CanvasMathGraphProps = {
    height: number;
    width: number;
}

export const CanvasMathGraph = ({ height, width }: CanvasMathGraphProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasUpperLayerRef = useRef<HTMLCanvasElement>(null); // The idea behind a second layer is for the sake of animation optimization.
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const contextLayerRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasLayer = canvasUpperLayerRef.current;

        if (!canvas || !canvasLayer) {
            return;
        }

        contextRef.current = canvas.getContext('2d');
        contextLayerRef.current = canvasLayer.getContext('2d');

        const context = contextRef.current;

        if (!context) {
            return;
        }

        const graph = new Graph({ width, height, min: -20, max: 20 });
        graph.initialize(context, 'white');
        graph.generateAxes(context, 'black');

    }, [width, height]);

    return (
        <div className='canvasContainer'>
            <canvas className='canvas' height={height} width={width} ref={canvasRef} />
            <canvas className='canvas' height={height} width={width} ref={canvasUpperLayerRef} />
        </div>
    );
}