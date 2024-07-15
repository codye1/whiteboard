import Placement2D from '../types/shape';
import { SizeRect } from '../types/shape';

const shapeSizing = {
  getRectSize: ({ height, width }: SizeRect, { x, y }: Placement2D) => ({
    width,
    height,
    x: x - width / 2,
    y: y - height / 2,
  }),
  getEllipseSize: ({ height, width }: SizeRect, { x, y }: Placement2D) => ({
    radiusX: width / 2,
    radiusY: height / 2,
    x,
    y,
  }),
};

export default shapeSizing;
