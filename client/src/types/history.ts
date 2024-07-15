import Placement2D from './shape';
import { Shape } from './shape';

export enum TypesHistoryOperation {
  ADD = 'ADD',
  DELETE = 'DELETE',
  CHANGE_POSITION = 'CHANGE_POSITION',
  CHANGE_STYLES = 'CHANGE_STYLES',
  CHANGE_TEXT_STYLES = 'CHANGE_TEXT_STYLES',
  CHANGE_TEXT = 'CHANGE_TEXT',
}

interface DefaultHistoryOperation {
  type: TypesHistoryOperation;
}

interface Add extends DefaultHistoryOperation {
  type: TypesHistoryOperation.ADD;
  shape: Shape;
}

interface Delete extends DefaultHistoryOperation {
  type: TypesHistoryOperation.DELETE;
  shapes: Shape[];
}

export interface shapeAndChangeValue {
  shapeID: string;
  position: Placement2D;
  scale: Placement2D;
  rotation: number;
}

interface ChangePosition extends DefaultHistoryOperation {
  type: TypesHistoryOperation.CHANGE_POSITION;
  positions: {
    oldValue: shapeAndChangeValue[];
    newValue: shapeAndChangeValue[];
  };
}

export type valueStyle = string | number | Placement2D | null;


interface ChangeStyle extends DefaultHistoryOperation {
  type: TypesHistoryOperation.CHANGE_STYLES;
  key: string;
  value: {
    newValue: valueStyle;
    oldValue: valueStyle;
  };
  ids: string[];
}


interface ChangeText {
  type: TypesHistoryOperation.CHANGE_TEXT;
  id: string;
  oldValue: string;
  newValue: string;
}

export type operation =
  | Add
  | Delete
  | ChangePosition
  | ChangeStyle
  | ChangeText;
