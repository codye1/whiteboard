import { LineCap, LineJoin } from 'konva/lib/Shape';

export enum TOOLS {
  HAND = 'HAND',
  CURSOR = 'CURSOR',
  LINE = 'LINE',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  BRUSH = 'BRUSH',
  TEXT = 'TEXT',
}
export enum ShapeType {
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  LINE = 'LINE',
  TEXT = 'TEXT',
}
export default interface Placement2D {
  x: number;
  y: number;
}

interface TransformVariable {
  scaleX: number;
  scaleY: number;
  rotation: number;
}

export interface SizeRect {
  width: number;
  height: number;
}

export interface SizeCircle {
  radiusX: number;
  radiusY: number;
}

export interface CommonStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  opacity: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;
}

export interface CommonTextStyle {
  fill: string;
  opacity: number;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  lineHeight: number;
  letterSpacing: number;
  align: string;
}

export interface ShapeStyles extends CommonStyle {
  tension: number;
  lineCap: LineCap;
  lineJoin: LineJoin;
}

export interface CommonShape extends Placement2D, TransformVariable {
  id: string;
  shadow?: boolean;
  type: ShapeType;
}

export interface Rectangle extends CommonShape, SizeRect, CommonStyle {
  type: ShapeType.RECTANGLE;
}

export interface Circle extends CommonShape, SizeRect, CommonStyle, SizeCircle {
  type: ShapeType.CIRCLE;
}

export interface Text extends CommonShape, CommonTextStyle {
  type: ShapeType.TEXT;
  text: string;

  width?: number;
  height?: number;
}

export interface Line extends CommonShape, CommonStyle {
  type: ShapeType.LINE;
  tension: number;
  lineCap: LineCap;
  lineJoin: LineJoin;
  points: number[];
  width?: number;
  height?: number;
}

export type Shape = Rectangle | Circle | Line | Text;
