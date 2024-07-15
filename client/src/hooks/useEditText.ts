import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { MutableRefObject, useRef } from 'react';
import { Shape, ShapeType, TOOLS } from '../types/shape';
import Konva from 'konva';
import { useAppDispatch, useAppSelector } from './hooks';
import { addToHistory, setShapes } from '../reducers/canvas';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { TypesHistoryOperation, operation } from '../types/history';
import { message, MessageTypes } from '../types/message';

interface IUseEditText {
  transformerRef: MutableRefObject<Transformer>;
  tool: TOOLS;
  stageScale: number;
  shapesRef: MutableRefObject<Shape[]>;
  sendMessage: (message: message) => void;
}

const useEditText = ({
  transformerRef,
  tool,
  stageScale,
  shapesRef,
  sendMessage,
}: IUseEditText) => {
  const { userName, roomId } = useAppSelector((state) => state.canvas);

  const textArea = document.createElement('textarea');
  const textAreaRef = useRef(textArea);
  const dispatch = useAppDispatch();
  let oldValue: string;

  const openEditText = (
    mouseEvent: KonvaEventObject<MouseEvent>,
    isAddShape?: Node<NodeConfig>
  ) => {
    transformerRef.current.nodes([]);
    if (
      mouseEvent.target.attrs.type !== ShapeType.TEXT &&
      tool !== TOOLS.CURSOR &&
      !isAddShape
    )
      return;

    const node = isAddShape ? isAddShape : mouseEvent.target;

    if (!node) return;
    const stage = mouseEvent.target.getStage();
    if (!stage) return;
    node.hide();
    if (!(node instanceof Konva.Text)) {
      return;
    }

    const position = node.absolutePosition();
    const areaPosition = {
      x: stage.container().offsetLeft + position.x,
      y: stage.container().offsetTop + position.y,
    };

    oldValue = node.text();

    document.body.appendChild(textAreaRef.current);

    textAreaRef.current.value = node.text();
    textAreaRef.current.style.position = 'absolute';

    /*
    textAreaRef.current.style.top =
      areaPosition.y - (node.fontSize() / 10) * (stageScale * 0.7) + 'px';

    textAreaRef.current.style.left = areaPosition.x + 'px';
    */
    textAreaRef.current.style.top = areaPosition.y + 'px';
    textAreaRef.current.style.left = areaPosition.x + 'px';

    if (node.text().length==0) {
      textAreaRef.current.style.width = ((node.width()*stageScale)+node.fontSize()*stageScale) + 'px';
      textAreaRef.current.style.height = node.height()*stageScale + 'px';
    }else{
      textAreaRef.current.style.width = node.width()*stage.getAbsoluteScale().x + 'px';
      textAreaRef.current.style.height = node.height()*stage.getAbsoluteScale().y + 'px';
    }
    console.log(stage.getAbsoluteScale());

    textAreaRef.current.style.fontSize = node.fontSize() * stageScale + 'px';
    textAreaRef.current.style.border = 'none';
    textAreaRef.current.style.padding = '0px';
    textAreaRef.current.style.margin = '0px';
    textAreaRef.current.style.overflow = 'hidden';
    textAreaRef.current.style.background = 'none';
    textAreaRef.current.style.outline = 'none';
    textAreaRef.current.style.resize = 'none';
    textAreaRef.current.style.fontStyle = node.fontStyle();
    textAreaRef.current.style.lineHeight = `${node.lineHeight()}`;
    textAreaRef.current.style.fontFamily = node.fontFamily();
    textAreaRef.current.style.textAlign = node.align()
    textAreaRef.current.style.stroke = node.stroke();
    textAreaRef.current.style.fontWeight = '500';
    textAreaRef.current.style.transformOrigin = 'left top';
    textAreaRef.current.style.textAlign = node.align();
    textAreaRef.current.style.color = node.fill();
    textAreaRef.current.style.letterSpacing = node.letterSpacing() + "px"
    const rotation = node.rotation();

    if (roomId) {
      sendMessage({
        type:MessageTypes.START_CHANGE_SHAPE,
        userName,
        id:roomId,
        ids:node.attrs.id
      })

    }
    let transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    textAreaRef.current.style.height = 'auto';
    // after browsers resized it we can set actual value
    textAreaRef.current.style.height =
      textAreaRef.current.scrollHeight + 3 + 'px';
    const scale = node.scale();

    if (scale) {
      transform += `scale(${scale.x},${scale.y})`;
    }

    textAreaRef.current.style.transform = transform;
    textAreaRef.current.focus();

    function removeTextarea() {
      if (textAreaRef.current.parentNode) {
        textAreaRef.current.parentNode.removeChild(textAreaRef.current);
        const newShapes = shapesRef.current.map((shape) =>
          shape.id == node.attrs.id
            ? {
                ...shape,
                text: textAreaRef.current.value,
              }
            : shape
        );
        dispatch(setShapes(newShapes));
        if (roomId) {
          sendMessage({
            type: MessageTypes.CHANGE_SHAPE,
            userName,
            id: roomId,
            value: newShapes,
          });
        }
        const operation: operation = {
          type: TypesHistoryOperation.CHANGE_TEXT,
          id: node.attrs.id,
          oldValue,
          newValue: textAreaRef.current.value,
        };

        dispatch(addToHistory(operation));

        if (roomId) {
          sendMessage({
            type: MessageTypes.ADD_TO_HISTORY,
            userName,
            id: roomId,
            operation,
          });
        }

        window.removeEventListener('click', handleOutsideClick);
        textAreaRef.current.removeEventListener('keydown', keyDownHandler);
        node.show();
      }
    }

    function handleOutsideClick(e: MouseEvent) {
      if (e.target !== textArea && node instanceof Konva.Text) {
        node.text(textAreaRef.current.value);
        removeTextarea();
      }
    }
    const keyDownHandler = () => {
      //textAreaRef.current.style.width = '50px'
      // textAreaRef.current.style.width  = (textAreaRef.current.value.length+1)*(node.fontSize()*(stageScale)) + "px"
      // textAreaRef.current.style.width = (textAreaRef.current.value.length+1)*(14*stageScale) + "px"

      node.text(textAreaRef.current.value)
      textAreaRef.current.style.width = node.width()*stageScale+(node.fontSize()*stageScale)+ "px"
      textAreaRef.current.style.height = node.height()*stageScale+(node.fontSize()*stageScale) + "px"

    };
    const k = ( ) => {
      if (roomId) {

        sendMessage({
          type:MessageTypes.CHANGE_SHAPE,
          userName,
          id:roomId,
          value:{
            type:"editText",
            value:textAreaRef.current.value
          }
        })

      }
    }

    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
      textAreaRef.current.addEventListener("keydown", keyDownHandler);
      textAreaRef.current.addEventListener("keyup", k);
    });
  };

  return openEditText;
};

export default useEditText;
