import { IRect } from "konva/lib/types";


export const isShapeInSelection = (
  r1: IRect,
  r2: IRect
) => {
  return (
    r1.x >= r2.x &&
    r1.y >= r2.y &&
    r1.x + r1.width <= r2.x + r2.width &&
    r1.y + r1.height <= r2.y + r2.height
  );
};