import { Dispatch, MutableRefObject, useEffect, useRef } from 'react';
import Konva from 'konva';
import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { Layer } from 'konva/lib/Layer';
import { ISelectedArea, initialMouseArea } from './useMouseArea';
import isShapeInSelection from '../helpers/isShapeInSelection';
import { useAppDispatch, useAppSelector } from './hooks';
import { addToHistory, setShapes, setStyles, setTextStyles, } from '../reducers/canvas';
import getRelativeClientRect from '../helpers/getRealtiveClientRect';
import getStylesFromNode from '../helpers/getStylesFromNode';
import { TypesHistoryOperation } from '../types/history';
import { Shape, ShapeType, TOOLS } from '../types/shape';
import { MessageTypes, message } from '../types/message';
import { Transformer } from 'konva/lib/shapes/Transformer';
import getTextStylesFromNode from '../helpers/getTextStylesFromNode';
import getRelativePointerPosition from '../helpers/getRelativeMousePosition';

const useSelect = (
  previewLayer: MutableRefObject<Layer | null>,
  tool: TOOLS,
  setTool: Dispatch<React.SetStateAction<TOOLS>>,
  selectedArea: ISelectedArea,
  mainLayer: MutableRefObject<Layer | null>,
  sendMessage: (message: message) => void,
  shapesRef: MutableRefObject<Shape[]>,
  transformerRef: MutableRefObject<Transformer>,
  isChange: MutableRefObject<boolean>
) => {
  const selectedShapeRef = useRef<Shape | null>(null);
  const ctrlDownRef = useRef(false);
  const mouseDownRef = useRef(false);
  const selectedAreaRef = useRef<ISelectedArea>(selectedArea);
  const transformerHaveText = useRef<Node<NodeConfig>|null>(null)
  const { shapes, userName, roomId, styles , textStyles } = useAppSelector(
    (state) => state.canvas
  );
  const dispatch = useAppDispatch();
  const shapesInAreaRef = useRef<Shape[] | null>(null);

  function onMouseDownHandlerSelect(event: KonvaEventObject<MouseEvent>) {
    if (tool !== TOOLS.CURSOR) return;
    const stage = event.target.getStage();

    if (event.target == stage) {
      selectedAreaRef.current = initialMouseArea;
      transformerRef.current.nodes([]);
      shapesInAreaRef.current = [];
      selectedShapeRef.current = null;
      transformerHaveText.current = null
      return;
    }

    if (
      transformerRef.current
        .nodes()
        .find((node) => node.attrs.id == event.target.attrs.id)
    )
      return;

    if (mainLayer.current) {
      mainLayer.current.add(transformerRef.current);
    }

    selectedShapeRef.current =
      shapes.find((shape) => shape.id === event.target.attrs.id) || null;
    event.target.attrs.type == ShapeType.TEXT? transformerHaveText.current = event.target : null

    if (selectedShapeRef.current) {
      if (!ctrlDownRef.current) transformerRef.current.nodes([]);

      const nodes = transformerRef.current.nodes();

      transformerRef.current.nodes([...nodes, event.target]);

    }
  }

  useEffect(() => {
    selectedShapeRef.current = null;
    transformerRef.current.nodes([]);
  }, [tool, setTool]);

  useEffect(() => {
    selectedAreaRef.current = selectedArea; // Update ref when selectedArea changes
  }, [selectedArea]);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      let newShapes = shapesRef.current;
      let nodes;
      const deletedShapes: Shape[] = [];

      switch (e.key.toLowerCase()) {
        case 'control':
          ctrlDownRef.current = true;
          break;
        case 'delete':
          nodes = transformerRef.current.nodes();
          if (roomId) {
            const ids = nodes.map((node) => node.attrs.id);
            sendMessage({
              type: MessageTypes.DELETE_SHAPE,
              userName,
              roomId,
              ids,
            });
          }

          nodes.forEach((node) => {
            newShapes = newShapes.filter((shape) => {
              if (shape.id == node.attrs.id) {
                deletedShapes.push(shape);
              }

              return shape.id !== node.attrs.id;
            });
            node.destroy();
          });
          dispatch(setShapes(newShapes));
          dispatch(
            addToHistory({
              type: TypesHistoryOperation.DELETE,
              shapes: deletedShapes,
            })
          );
          selectedAreaRef.current = initialMouseArea;
          transformerRef.current.nodes([]);
          shapesInAreaRef.current = [];
          selectedShapeRef.current = null;
          break;
        case 'a':
          if (ctrlDownRef.current) {
            const ids = shapesRef.current.map((shape) => shape.id);
            const allNodes = ids
              .map((id) => mainLayer.current?.findOne(`#${id}`))
              .filter((node): node is Node<NodeConfig> => node !== undefined);

            transformerRef.current.nodes(allNodes);
          }
          break;
        default:
          break;
      }
    };
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        ctrlDownRef.current = false;
      }
    };
    let timeout: ReturnType<typeof setTimeout>;

    const mouseMoveHandler = () => {
      if (roomId) {
        const stage = mainLayer.current?.getStage()

        if (!stage) {
          return
        }

        const mousePosition = getRelativePointerPosition(stage)

        if (!mousePosition) {
          return
        }

        sendMessage({
          type:MessageTypes.MOUSE_MOVE,
          userName,
          roomId,
          mousePosition
        })
      }
      if (
        !mouseDownRef.current ||
        selectedShapeRef.current ||
        tool !== TOOLS.CURSOR ||
        isChange.current
      ) {
        return;
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        shapesInAreaRef.current =
          shapesRef.current.filter((shape) => {
            const node = mainLayer.current?.findOne(`#${shape.id}`);
            if (node) {
              const relativeClientRect = getRelativeClientRect(node);
              if (relativeClientRect) {
                return isShapeInSelection(
                  relativeClientRect,
                  selectedAreaRef.current
                );
              }
            }
            return false;
          }) || null;
      }, 0);
    };

    const mouseUpHandler = () => {
      if (
        shapesInAreaRef.current &&
        transformerRef.current.nodes().length == 0
      ) {
        selectedShapeRef.current = null;
        transformerHaveText.current = null
        const nodeShapes = shapesInAreaRef.current
          .map((shape) => mainLayer.current?.findOne(`#${shape.id}`))
          .filter((node): node is Konva.Node => {
            if (node?.attrs.type == ShapeType.TEXT) {
              transformerHaveText.current = node
            }
            return node !== undefined
          });
        transformerRef.current.nodes(nodeShapes);

        if (mainLayer.current) {
          mainLayer.current.add(transformerRef.current);
        } else if (previewLayer.current) {
          previewLayer.current.add(transformerRef.current);
        }

        transformerRef.current.getLayer()?.batchDraw();
      }
      mouseDownRef.current = false;

      const nodes = transformerRef.current.nodes();

      if (nodes.length > 0) {
        console.log("work");

        dispatch(setStyles(getStylesFromNode(nodes[0], styles)));
      }
      if (transformerHaveText.current) {
        console.log("work");
        dispatch(setTextStyles(getTextStylesFromNode(transformerHaveText.current,textStyles)))
      }
    };

    const mouseDownHandler = () => {
      mouseDownRef.current = true;
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [tool, roomId, userName]);

  return { onMouseDownHandlerSelect, mainLayer, ctrlDownRef, transformerRef , transformerHaveText};
};

export default useSelect;
