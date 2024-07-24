import { KonvaEventObject } from 'konva/lib/Node';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { MutableRefObject, useRef } from 'react';
import { Transformer } from 'konva/lib/shapes/Transformer';
import {
  TypesHistoryOperation,
  operation,
  shapeAndChangeValue,
} from '../../types/history';
import { message, MessageTypes } from '../../types/message';
import { addToHistory, setShapes } from '../../reducers/canvas';

const useHandlers = (
  sendMessage: (message: message) => void,
  transformerRef: MutableRefObject<Transformer>,
  isChange: MutableRefObject<boolean>
) => {
  const dispatch = useAppDispatch();
  const { shapes, roomId, userName } = useAppSelector((state) => state.canvas);

  const onChange = (event: KonvaEventObject<Event>) => {
    const nodes = transformerRef.current.nodes();
    // если handler сработал не на последнюю фигуру в nodes то return
    if (event.target.attrs.id !== nodes[nodes.length - 1].attrs.id) {
      return;
    }
    if (roomId) {
      sendMessage({
        type:MessageTypes.CHANGE_SHAPE,
        userName,
        roomId,
        value:{
          type:'dragOrTransform',
          newValue:transformerRef.current.nodes().map(node=>{
            return {
              id:node.attrs.id,
              position:{x:node.x(),y:node.y()},
              scale:{x:node.scaleX(),y:node.scaleY()},
              rotate:node.rotation()
            }
          })
        }
      })
    }

  };

  /*
   // Create a lookup map for nodes
    const nodeMap = new Map<string, (typeof nodes)[number]>();
    nodes.forEach((node) => {
      nodeMap.set(node.attrs.id, node);
    });

    // Map shapes to newShapes using the lookup map
    const newShapes = shapes.map((shape) => {
      const node = nodeMap.get(shape.id);
      if (!node) return shape;

      return {
        ...shape,
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      };
    });

    if (roomId) {
      sendMessage({
        type: MessageTypes.CHANGE_SHAPE,
        id: roomId,
        userName,
        value: newShapes,
      });
    }
  */

  const oldValue = useRef<shapeAndChangeValue[]>([]);

  const onChangeStart = (event:KonvaEventObject<Event>) => {
    isChange.current = true;
    const nodes = transformerRef.current.nodes()
    if (event.target.attrs.id !== nodes[nodes.length - 1].attrs.id) {
      return;
    }
    oldValue.current = [];
    transformerRef.current.nodes().forEach((node) => {
      oldValue.current.push({
        shapeID: node.attrs.id,
        position: { x: node.x(), y: node.y() },
        scale: { x: node.scaleX(), y: node.scaleY() },
        rotation: node.rotation(),
      });
    });

   if (roomId) {
    sendMessage({
      type:MessageTypes.START_CHANGE_SHAPE,
      userName,
      roomId,
      ids:transformerRef.current.nodes().map(node=>node.attrs.id)
    })
   }
  };

  const onChangeEnd = (ev: KonvaEventObject<Event>) => {
    const nodes = transformerRef.current.nodes();
    // если handler сработал не на последнюю фигуру в nodes то return
    isChange.current = false;
    if (ev.target.attrs.id !== nodes[nodes.length - 1].attrs.id) {
      return;
    }

    const newValue: shapeAndChangeValue[] = [];

    const newShapes = shapes.map((shape) => {
      const nodeIndex = nodes.findIndex((node) => node.attrs.id == shape.id);
      if (nodeIndex == -1) return shape;
      const node = nodes[nodeIndex];

      newValue.push({
        shapeID: node.attrs.id,
        position: { x: node.x(), y: node.y() },
        scale: { x: node.scaleX(), y: node.scaleY() },
        rotation: node.rotation(),
      });

      return {
        ...shape,
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      };
    });

    dispatch(setShapes(newShapes));

    const operation: operation = {
      type: TypesHistoryOperation.CHANGE_POSITION,
      positions: {
        oldValue: oldValue.current,
        newValue,
      },
    };

    dispatch(addToHistory(operation));
    if (roomId) {
      sendMessage({
        type: MessageTypes.ADD_TO_HISTORY,
        roomId,
        userName,
        operation,
      });
      sendMessage({
        type:MessageTypes.CHANGE_SHAPE,
        userName,
        roomId,
        value:newShapes
      })
    }
  };

  const onDragStart = onChangeStart;
  const onTransformEnd = onChangeEnd;
  const onTransformStart = onChangeStart;
  const onDragEnd = onChangeEnd;
  const onDragMove = onChange;
  const onTransform = onChange;

  return {
    onDragStart,
    onTransformEnd,
    onTransformStart,
    onDragMove,
    onTransform,
    onDragEnd,
  };
};

export default useHandlers;
