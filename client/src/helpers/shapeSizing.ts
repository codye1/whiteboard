import Placement2D from '../types/index';
import { Size } from '../types/index';

export const shapeSizing = {
  getRectSize: ({ height, width }: Size, { x, y }: Placement2D) => ({
    width,
    height,
    x: x - width / 2,
    y: y - height / 2,
  }),
  getEllipseSize: ({ height, width }: Size, { x, y }: Placement2D) => ({
    radiusX: width / 2,
    radiusY: height / 2,
    x,
    y,
  }),
};