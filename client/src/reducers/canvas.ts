import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TypesHistoryOperation, operation } from '../types/history';
import { CommonTextStyle, Shape, ShapeStyles } from '../types/shape';

export const defaultStyles: ShapeStyles = {
  fill: '#9a8437',
  stroke: '#9a8437',
  tension: 0.05,
  lineCap: 'round',
  lineJoin: 'round',
  strokeWidth: 1,
  cornerRadius: 0,
  opacity: 1,
  shadowColor: '#000000',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowOpacity: 0.5,
};

export const textStyles: CommonTextStyle = {
  fill: '#9a8437',
  fontSize: 10,
  fontStyle: 'normal',
  fontFamily: 'cursive',
  lineHeight: 1,
  letterSpacing: 0,
  opacity: 1,
  align:"center"
};

export interface ICanvas {
  shapes: Shape[];
  history: operation[];
  undoHistory: operation[];
  styles: ShapeStyles;
  textStyles: CommonTextStyle;
  roomId: string | null;
  userName: string;
  modalWriteNameOpen: boolean;
}

const initialState: ICanvas = {
  shapes: [],
  history: [],
  undoHistory: [],
  styles: defaultStyles,
  textStyles: textStyles,
  roomId: null,
  userName: '',
  modalWriteNameOpen: false,
};

const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setShapes(state, action: PayloadAction<Shape[]>) {
      state.shapes = action.payload;
    },
    addToHistory(state, action: PayloadAction<operation>) {
      state.history.push(action.payload);
    },
    setHistory(state, action: PayloadAction<operation[]>) {
      state.history = action.payload;
    },
    setUndoHistory(state, action: PayloadAction<operation[]>) {
      state.undoHistory = action.payload;
    },
    undo(state) {
      const undoOperation = state.history.pop();
      if (undoOperation) {
        switch (undoOperation.type) {
          case TypesHistoryOperation.ADD:
            state.shapes = state.shapes.filter(
              (shape) => shape.id !== undoOperation.shape.id
            );
            break;
          case TypesHistoryOperation.DELETE:
            state.shapes = [...state.shapes, ...undoOperation.shapes];
            break;
          case TypesHistoryOperation.CHANGE_POSITION:
            state.shapes = state.shapes.map((shape) => {
              let newShape = shape;
              undoOperation.positions.oldValue.forEach((shape) => {
                if (shape.shapeID == newShape.id) {
                  newShape = {
                    ...newShape,
                    x: shape.position.x,
                    y: shape.position.y,
                    scaleX: shape.scale.x,
                    scaleY: shape.scale.y,
                    rotation: shape.rotation,
                  };
                }
              });
              return newShape;
            });
            break;
          case TypesHistoryOperation.CHANGE_STYLES:
            state.shapes = state.shapes.map((shape) =>
              undoOperation.ids.includes(shape.id)
                ? {
                    ...shape,
                    [undoOperation.key]: undoOperation.value.oldValue,
                  }
                : shape
            );
            break;
          case TypesHistoryOperation.CHANGE_TEXT:
            state.shapes = state.shapes.map((shape) => {
              if (undoOperation.id == shape.id) {
                return {
                  ...shape,
                  text: undoOperation.oldValue,
                };
              }
              return shape;
            });
            break;
          default:
            break;
        }
        state.undoHistory.push(undoOperation);
      }
    },
    redo(state) {
      const redoOperation = state.undoHistory.pop();
      if (redoOperation) {
        switch (redoOperation.type) {
          case TypesHistoryOperation.ADD:
            state.shapes.push(redoOperation.shape);
            break;
          case TypesHistoryOperation.DELETE:
            redoOperation.shapes.forEach((redoShape) => {
              state.shapes = state.shapes.filter(
                (shape) => shape.id !== redoShape.id
              );
            });
            break;
          case TypesHistoryOperation.CHANGE_POSITION:
            state.shapes = state.shapes.map((shape) => {
              let newShape = shape;
              redoOperation.positions.newValue.forEach((shape) => {
                if (shape.shapeID == newShape.id) {
                  newShape = {
                    ...newShape,
                    x: shape.position.x,
                    y: shape.position.y,
                    scaleX: shape.scale.x,
                    scaleY: shape.scale.y,
                    rotation: shape.rotation,
                  };
                }
              });
              return newShape;
            });
            break;
          case TypesHistoryOperation.CHANGE_STYLES:
            state.shapes = state.shapes.map((shape) =>
              redoOperation.ids.includes(shape.id)
                ? {
                    ...shape,
                    [redoOperation.key]: redoOperation.value.newValue,
                  }
                : shape
            );
            break;
          case TypesHistoryOperation.CHANGE_TEXT:
            state.shapes = state.shapes.map((shape) => {
              if (redoOperation.id == shape.id) {
                return {
                  ...shape,
                  text: redoOperation.newValue,
                };
              }
              return shape;
            });
            break;
          default:
            break;
        }
        state.history.push(redoOperation);
      }
    },
    setStyles(state, action: PayloadAction<ShapeStyles>) {
      state.styles = action.payload;
    },
    setTextStyles(state,action:PayloadAction<CommonTextStyle>){
      state.textStyles = action.payload
    },
    setroomId(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
      console.log(action.payload);
    },
    setModalWriteNameOpen(state, action: PayloadAction<boolean>) {
      state.modalWriteNameOpen = action.payload;
    },
    initCanvas(state, action: PayloadAction<ICanvas>) {
      state.history = action.payload.history;
      state.shapes = action.payload.shapes;
      state.undoHistory = action.payload.undoHistory;
      state.userName = action.payload.userName;
    },
    clearCanvas() {
      return initialState;
    },
  },
});

export const {
  setShapes,
  setStyles,
  setTextStyles,
  setroomId,
  setName,
  setModalWriteNameOpen,
  addToHistory,
  undo,
  redo,
  setHistory,
  setUndoHistory,
  initCanvas,
  clearCanvas,
} = canvas.actions;

export default canvas;
