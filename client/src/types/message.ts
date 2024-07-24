import { IRect } from 'konva/lib/types';
import { operation } from './history';
import Placement2D, { Shape, SizeCircle } from './shape';

export enum MessageTypes {
  ADD_SHAPE = 'ADD_SHAPE',
  CHANGE_SHAPE = 'CHANGE_SHAPE',
  START_CHANGE_SHAPE = 'START_CHANGE_SHAPE',
  END_CHANGE_SHAPE = 'END_CHANGE_SHAPE',
  DELETE_SHAPE = 'DELETE_SHAPE',
  CONNECT = 'CONNECT',
  USER_CONNECTED = 'USER_CONNECTED',
  SEND_INIT_SHAPES = 'SEND_INIT_SHAPES',
  PREVIEW_SHAPE_ADD = 'PREVIEW_SHAPE_ADD',
  PREVIEW_SHAPE_CHANGE = 'PREVIEW_SHAPE_CHANGE',
  UNDO = 'UNDO',
  REDO = 'REDO',
  ADD_TO_HISTORY = 'ADD_TO_HISTORY',
  MOUSE_MOVE="MOUSE_MOVE"
}

interface DefaultMessage {
  type: MessageTypes;
  userName: string;
  roomId: string;
  id?:string
}

interface AddShape extends DefaultMessage {
  type: MessageTypes.ADD_SHAPE;
  shape: Shape;
}


interface DragOrTransform  {
  type:"dragOrTransform"
  newValue:{
    id:string
    position:Placement2D
    scale:Placement2D
    rotate:number
  }[]
}

interface EditText {
  type:"editText"
  value:string
}

type valueChangeShape = Shape[] | DragOrTransform | EditText

interface ChangeShape extends DefaultMessage {
  type: MessageTypes.CHANGE_SHAPE;
  value: valueChangeShape;
}

interface StartChangeShape extends DefaultMessage {
  type:MessageTypes.START_CHANGE_SHAPE
  ids:string[] | string
}

interface EndChangeShape extends DefaultMessage {
  type:MessageTypes.END_CHANGE_SHAPE
}

interface DeleteShape extends DefaultMessage {
  type: MessageTypes.DELETE_SHAPE;
  ids: string[];
}

interface Connect extends DefaultMessage {
  type: MessageTypes.CONNECT;
}

interface UserConnected extends DefaultMessage {
  type: MessageTypes.USER_CONNECTED;

}

export interface SendInitShapes extends DefaultMessage {
  type: MessageTypes.SEND_INIT_SHAPES;
  shapes: Shape[];
  history: operation[];
  undoHistory: operation[];
  mouses:{userName:string,socketId:string}[]
}

export interface PreviewShapeAdd extends DefaultMessage {
  type: MessageTypes.PREVIEW_SHAPE_ADD;
  shape: Shape;
  tool: string;
}

interface ShapeAndAttr {
  attr: IRect | (Placement2D & SizeCircle);
}

interface AttrAndVal {
  attr: string;
  val: number[];
}

export type attrs = ShapeAndAttr | AttrAndVal;

export interface PreviewShapeChange extends DefaultMessage {
  type: MessageTypes.PREVIEW_SHAPE_CHANGE;
  shape: Shape;
  attrs: attrs;
}

interface Undo extends DefaultMessage {
  type: MessageTypes.UNDO;
}

interface Redo extends DefaultMessage {
  type: MessageTypes.REDO;
}

interface AddToHistory extends DefaultMessage {
  type: MessageTypes.ADD_TO_HISTORY;
  operation: operation;
}

interface MouseMove extends DefaultMessage {
  type:MessageTypes.MOUSE_MOVE
  mousePosition:Placement2D
}

export type message =
  | AddShape
  | ChangeShape
  | StartChangeShape
  | EndChangeShape
  | DeleteShape
  | Connect
  | UserConnected
  | SendInitShapes
  | PreviewShapeAdd
  | PreviewShapeChange
  | Undo
  | Redo
  | AddToHistory
  | MouseMove

