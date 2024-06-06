import { LineCap, LineJoin } from "konva/lib/Shape";

export enum TOOLS{
    HAND = "HAND",
    CURSOR = "CURSOR",
    LINE = "LINE",
    RECTANGLE = "RECTANGLE",
    CIRCLE = "CIRCLE",
    BRUSH = "BRUSH",
}

export default interface Placement2D{
    x: number
    y: number
}

export enum ShapeType {
    RECTANGLE = "RECTANGLE",
    CIRCLE = "CIRCLE",
    TEXT = "TEXT",
    LINE = "LINE",
  }


  export interface Size {
    width: number;
    height: number;
  }

  export interface CommonStyle {
    fill: string;
    stroke: string;
    strokeWidth: number;
    cornerRadius:number;
    opacity:number;
    shadowColor: string,
    shadowBlur: number,
    shadowOffset: Placement2D,
    shadowOpacity: number,
  }

  export interface ShapeStyles extends CommonStyle {
    tension:number,
    lineCap:LineCap,
    lineJoin:LineJoin,
  }

  export interface CommonShape extends Placement2D {
    id: string;
    selected?: boolean;
    shadow?:boolean
    type: ShapeType;
  }

  export interface Rectangle extends CommonShape, Size, CommonStyle {
    type: ShapeType.RECTANGLE;
  }

  export interface Circle extends CommonShape, Size, CommonStyle {
    type: ShapeType.CIRCLE;
    radiusX: number;
    radiusY: number;
  }

  export interface Text extends CommonShape {
    type: ShapeType.TEXT;
    text: string;
    fontSize: number;
  }

  export interface Line extends CommonShape, CommonStyle {
    type: ShapeType.LINE;

    tension:number
    lineCap:LineCap
    lineJoin:LineJoin
    points: number[];
  }

  export type Shape = Rectangle | Circle | Text | Line;