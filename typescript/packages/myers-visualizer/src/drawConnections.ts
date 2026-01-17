import type { Animation, Connection } from "./types";

type DrawConnectionsArgs = {
  ctx: CanvasRenderingContext2D;
  connections: Connection[];
  startX: number;
  startY: number;
  distanceX: number;
  distanceY: number;
  animation?: Animation;
};

export const drawConnections = ({
  ctx,
  connections,
  startX,
  startY,
  distanceX,
  distanceY,
  animation,
}: DrawConnectionsArgs) => {
  if (!animation) {
    for (let i = 0; i < connections.length; i++) {
      const { from, to } = connections[i];
      const connectionStartX = from.x * distanceX + startX;
      const connectionStartY = from.y * distanceY + startY;
      const connectionEndX = to.y * distanceX + startX;
      const connectionEndY = to.y * distanceY + startY;

      ctx.beginPath();
      ctx.moveTo(connectionStartX, connectionStartY);
      ctx.lineTo(connectionEndX, connectionEndY);
      ctx.stroke();
    }
  }
};
