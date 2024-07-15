import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { MutableRefObject, useRef, useState } from 'react';
import { Layer } from 'konva/lib/Layer';

import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from './hooks';
import { addToHistory, setShapes } from '../reducers/canvas';
import shapeSizing from '../helpers/shapeSizing';
import getRelativePointerPosition from '../helpers/getRelativeMousePosition';
import getNewSelectAreaSize from '../helpers/getSizeArea';
import { TypesHistoryOperation } from '../types/history';
import { Shape, ShapeType, TOOLS } from '../types/shape';
import { MessageTypes, message, attrs } from '../types/message';

export interface ISelectedArea {
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
}

export const initialMouseArea: ISelectedArea = {
  visible: true,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  startX: 0,
  startY: 0,
};

const useMouseArea = (
  tool: string,
  sendMessage: (message: message) => void,
  previewLayerRef: MutableRefObject<Layer | null>,
  openEditText: (
    mouseEvent: KonvaEventObject<MouseEvent>,
    isAddShape?: Node<NodeConfig>
  ) => void,
  setTool: React.Dispatch<React.SetStateAction<TOOLS>>
) => {
  const mouseDown = useRef(false);
  const [selectedArea, setSelectedArea] = useState(initialMouseArea);
  const shapePreview = useRef<Shape | null>(null);
  const { shapes, styles, roomId, userName, textStyles } =
    useAppSelector((state) => state.canvas);
  const dispatch = useAppDispatch();
  const shape = shapePreview.current;
  const shapeToEdit = previewLayerRef.current?.findOne(`#${shape?.id}`);

  const mouseMoveHandler = (event: KonvaEventObject<MouseEvent>) => {
    if (!mouseDown.current) return;

    const stage = event.target.getStage();
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    const { height, width, x, y } = getNewSelectAreaSize(pos, {
      x: selectedArea.startX,
      y: selectedArea.startY,
    });

    if (TOOLS.CURSOR == tool) {
      const rectSelection = shapeSizing.getRectSize(
        { height, width },
        { x, y }
      );
      setSelectedArea({ ...selectedArea, ...rectSelection });
    }

    if (!shape || !shapeToEdit) return;

    let attrs = {} as attrs;

    if (TOOLS.RECTANGLE == tool) {
      const rectSelection = shapeSizing.getRectSize(
        { height, width },
        { x, y }
      );
      shapeToEdit.setAttrs(rectSelection);
      attrs.attr = { ...rectSelection };

      shapePreview.current = { ...shape, ...rectSelection };
    }

    if (TOOLS.CIRCLE == tool) {
      const circleSelection = shapeSizing.getEllipseSize(
        { height, width },
        { x, y }
      );
      shapeToEdit.setAttrs(circleSelection);
      attrs.attr = { ...circleSelection };

      shapePreview.current = { ...shape, ...circleSelection };
    }
    if (TOOLS.LINE == tool && shape.type == ShapeType.LINE) {
      shape.points[2] = pos.x;
      shape.points[3] = pos.y;

      shapeToEdit.setAttr('points', shape.points);
      attrs = {
        attr: 'points',
        val: shape.points,
      };

      shapePreview.current = { ...shape };
    }
    if (TOOLS.BRUSH == tool && shape.type == ShapeType.LINE) {
      const points = shape.points.concat([pos.x, pos.y]);
      shape.points = points;
      shapeToEdit.setAttr('points', points);
      attrs = {
        attr: 'points',
        val: shape.points,
      };
      shapePreview.current = { ...shape };
    }

    if (roomId) {
      sendMessage({
        userName,
        id: roomId,
        type: MessageTypes.PREVIEW_SHAPE_CHANGE,
        shape: shape,
        attrs: attrs,
      });
    }

    previewLayerRef.current?.batchDraw();
  };

  const onMouseDownHandlerArea = (event: KonvaEventObject<MouseEvent>) => {
    if (tool == TOOLS.HAND) return;
    const stage = event.target.getStage();
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    mouseDown.current = true;

    if (stage) {
      setSelectedArea((area) => ({ ...area, startX: pos.x, startY: pos.y }));
    }

    let shape: Shape | null = null;
    const shapeId = uuidv4();

    if (tool == TOOLS.RECTANGLE) {
      shape = {
        type: ShapeType.RECTANGLE,
        id: shapeId,
        shadow: false,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        ...styles,
        ...selectedArea,
      };
    }
    if (tool == TOOLS.CIRCLE) {
      shape = {
        type: ShapeType.CIRCLE,
        id: shapeId,
        shadow: false,
        ...styles,
        radiusX: 0,
        radiusY: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        ...pos,
      };
    }
    if (tool == TOOLS.LINE) {
      shape = {
        type: ShapeType.LINE,
        id: shapeId,
        shadow: false,
        ...styles,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        points: [pos.x, pos.y],
      };
    }
    if (tool == TOOLS.BRUSH) {
      shape = {
        type: ShapeType.LINE,
        id: shapeId,
        shadow: false,
        ...styles,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        points: [pos.x, pos.y],
      };
    }
    if (tool == TOOLS.TEXT) {
      shape = {
        type: ShapeType.TEXT,
        id: shapeId,
        shadow: false,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        text: '',
        x: pos.x,
        y: pos.y,
        ...textStyles,
      };
    }

    if (!shape) return;

    shapePreview.current = shape;

    switch (tool) {
      case TOOLS.RECTANGLE:
        previewLayerRef.current?.add(new Konva.Rect(shape));
        break;
      case TOOLS.CIRCLE:
        previewLayerRef.current?.add(
          new Konva.Ellipse({ ...shape, radiusX: 0, radiusY: 0 })
        );
        break;
      case TOOLS.LINE:
        previewLayerRef.current?.add(new Konva.Line({ ...shape, width: 0 }));
        break;
      case TOOLS.BRUSH:
        previewLayerRef.current?.add(new Konva.Line({ ...shape, width: 0 }));
        break;
    }

    if (roomId) {
      sendMessage({
        userName,
        id: roomId,
        type: MessageTypes.PREVIEW_SHAPE_ADD,
        shape: shape,
        tool: tool,
      });
    }
  };
  const mouseUpHandler = (event: KonvaEventObject<MouseEvent>) => {
    mouseDown.current = false;
    if (tool != TOOLS.HAND && tool != TOOLS.CURSOR) {
      const shape = shapePreview.current;
      if (!shape) return;
      const shapeToEdit = previewLayerRef.current?.findOne(`#${shape.id}`);
      shapeToEdit?.destroy();

      dispatch(
        addToHistory({
          type: TypesHistoryOperation.ADD,
          shape,
        })
      );

      if (roomId) {
        sendMessage({
          type: MessageTypes.ADD_SHAPE,
          shape,
          id: roomId,
          userName,
        });
      }

      dispatch(setShapes([...shapes, shape]));

      if (shape.type == ShapeType.TEXT) {
        setTool(TOOLS.CURSOR);
        const stage = event.currentTarget.getStage();
        const node = stage?.findOne(`#${shape.id}`);
        if (node) {
          openEditText(event, node);
        }
      }

      shapePreview.current = null;
    }
    setSelectedArea(initialMouseArea);
  };

  return {
    onMouseDownHandlerArea,
    mouseMoveHandler,
    mouseUpHandler,
    selectedArea,
  };
};

export default useMouseArea;
