import { MutableRefObject, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  addToHistory,
  redo,
  setHistory,
  setShapes,
  setUndoHistory,
  undo,
} from '../reducers/canvas';
import { Layer } from 'konva/lib/Layer';
import Konva from 'konva';
import { Node, NodeConfig } from 'konva/lib/Node';
import { Shape as KonvaShape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { TypesHistoryOperation, operation } from '../types/history';
import { io } from 'socket.io-client';
import { MessageTypes, message } from '../types/message';
import { Shape, TOOLS } from '../types/shape';
import useUserConnectedAlert from './useUserConnectedAlert';
import { Text } from 'konva/lib/shapes/Text';

const socket = io(import.meta.env.VITE_CLIENT);

const useWebSocket = (
  previewLayerRef: MutableRefObject<Layer | null>,
  mainLayerRef: MutableRefObject<Layer | null>,
  shapesRef: MutableRefObject<Shape[]>,
  undoHistoryRef: React.MutableRefObject<operation[]>,
  historyRef: React.MutableRefObject<operation[]>
) => {
  const { roomId, userName } = useAppSelector((state) => state.canvas);

  const dispatch = useAppDispatch();
  const shapeToEditRef = useRef<Node<NodeConfig> | null>(null);
  const { userConnectedAlert } = useUserConnectedAlert();
  const shapesForChange = useRef<Node<NodeConfig>[]>([])

  useEffect(() => {
    if (roomId) {
      socket.on('message', (data) => {
        let newShape: KonvaShape<ShapeConfig> | null = null;
        let searchedShape;

        const message: message = data;
        switch (message.type) {
          case MessageTypes.USER_CONNECTED:
            console.log(message.userName);

            userConnectedAlert(message.userName);
            sendMessage({
              ...message,
              type: MessageTypes.SEND_INIT_SHAPES,
              shapes: shapesRef.current,
              history: historyRef.current,
              undoHistory: undoHistoryRef.current,
            });
            break;
          case MessageTypes.SEND_INIT_SHAPES:
            dispatch(setShapes(message.shapes));
            dispatch(setHistory(message.history));
            dispatch(setUndoHistory(message.undoHistory));
            break;
          case MessageTypes.ADD_SHAPE:

            console.log("add1");
            if (roomId) {
              console.log("add2");
              shapeToEditRef.current?.destroy();
              dispatch(
                addToHistory({
                  type: TypesHistoryOperation.ADD,
                  shape: message.shape,
                })
              );
              dispatch(setShapes([...shapesRef.current, message.shape]));
            }
            break;
          case MessageTypes.PREVIEW_SHAPE_ADD:
            if (roomId) {
              switch (message.tool) {
                case TOOLS.RECTANGLE:
                  newShape = new Konva.Rect(message.shape);
                  break;
                case TOOLS.CIRCLE:
                  newShape = new Konva.Ellipse({
                    ...message.shape,
                    radiusX: 0,
                    radiusY: 0,
                  });
                  break;
                case TOOLS.LINE:
                  newShape = new Konva.Line({
                    ...message.shape,
                    x: 0,
                    y: 0,
                    width: 0,
                  });
                  break;
                case TOOLS.BRUSH:
                  newShape = new Konva.Line({
                    ...message.shape,
                    x: 0,
                    y: 0,
                    width: 0,
                  });
                  break;
              }
              if (newShape && shapeToEditRef) {
                previewLayerRef.current?.add(newShape);
                searchedShape = previewLayerRef.current?.findOne(
                  `#${message.shape.id}`
                );

                if (searchedShape) {
                  shapeToEditRef.current = searchedShape;
                }
              }
            }
            break;
          case MessageTypes.PREVIEW_SHAPE_CHANGE:
            if (roomId) {
              if ('val' in message.attrs) {
                shapeToEditRef.current?.setAttr(
                  message.attrs.attr,
                  message.attrs.val
                );
              } else {
                shapeToEditRef.current?.setAttrs(message.attrs.attr);
              }
            }
            break;
          case MessageTypes.UNDO:
            if (roomId) {
              dispatch(undo());
            }
            break;
          case MessageTypes.REDO:
            if (roomId) {
              dispatch(redo());
            }
            break;
          case MessageTypes.DELETE_SHAPE:
            if (roomId) {
              let newShapes = shapesRef.current;
              const deletedShapes: Shape[] = [];
              const transformer: Transformer | undefined =
                previewLayerRef.current?.findOne('.transformer');
              message.ids.forEach((id) => {
                newShapes = newShapes.filter((shape) => {
                  if (shape.id == id) {
                    deletedShapes.push(shape);
                  }
                  return shape.id !== id;
                });

                if (transformer) {
                  let nodes = transformer.nodes();
                  nodes = nodes.filter((node) => node.attrs.id !== id);
                  transformer.nodes(nodes);
                }
                mainLayerRef.current?.findOne(`#${id}`)?.destroy();
              });
              dispatch(setShapes(newShapes));
              dispatch(
                addToHistory({
                  type: TypesHistoryOperation.DELETE,
                  shapes: deletedShapes,
                })
              );
            }
            break;
          case MessageTypes.CHANGE_SHAPE:
            console.log("CHANGE");

            if ("type" in message.value) {
             if (message.value.type == "dragOrTransform") {
              message.value.newValue.forEach(value=>{
                const node = shapesForChange.current.find(node=>node.attrs.id==value.id)
                if (node) {
                  node.x(value.position.x)
                  node.y(value.position.y)
                  node.scaleX(value.scale.x)
                  node.scaleY(value.scale.y)
                  node.rotation(value.rotate)
                }
              })
             }else if(shapeToEditRef.current instanceof Text){
              console.log(message.value.value);

              shapeToEditRef.current.text(message.value.value)
              console.log(shapeToEditRef.current);

             }
            }else{
              dispatch(setShapes(message.value));
            }
            break;
          case MessageTypes.START_CHANGE_SHAPE:
            console.log("startt");

            if (roomId) {
              shapesForChange.current=[]
              if (typeof message.ids == "string") {
                const node = mainLayerRef.current?.findOne(`#${message.ids}`)


                if (node) {
                  console.log(node);

                  shapeToEditRef.current = node
                }
              }else{
                message.ids.forEach(id=>{
                  const node = mainLayerRef.current?.findOne(`#${id}`)
                  if (node) {
                    shapesForChange.current = [...shapesForChange.current,node]
                  }
                })
              }
            }
            break
          case MessageTypes.ADD_TO_HISTORY:
            if (roomId) {
              dispatch(addToHistory(message.operation));
            }
            break;
          default:
            break;
        }
      });
    }

    return () => {
      socket.off('message');
    };
  }, [userName, roomId]);

  const joinRoom = (roomId: string, userName: string) => {
    const initMessage = {
      type: MessageTypes.USER_CONNECTED,
      id: roomId,
      userName,
    };

    socket.emit('joinRoom', { roomId, userName, initMessage });
  };

  const leaveRoom = () => {
    if (roomId) {
      socket.emit('leaveRoom', roomId);
    }
  };

  const sendMessage = (message: message) => {
    if (roomId) {
      console.log(message);

      socket.emit('message', { roomId, message });
    }
  };

  return { sendMessage, joinRoom, leaveRoom };
};

export default useWebSocket;
