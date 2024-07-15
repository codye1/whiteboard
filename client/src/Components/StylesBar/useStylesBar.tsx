import { MutableRefObject } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addToHistory, setShapes, setStyles, setTextStyles } from "../../reducers/canvas";
import { message, MessageTypes } from "../../types/message";
import { operation, TypesHistoryOperation, valueStyle } from "../../types/history";
import { Transformer } from "konva/lib/shapes/Transformer";
import { ShapeType } from "../../types/shape";

const useStylesBar = (sendMessage: (message: message) => void , transformerRef: MutableRefObject<Transformer | null> )=>{
  const dispatch = useAppDispatch();
  const {shapes, roomId, userName , styles , textStyles } = useAppSelector(state=>state.canvas)
  const onChangeStyleHandler = (from:string ) => {
    return (keyStyle: string, value: valueStyle , )=>{
      if (from=="text") {
        dispatch(
          setTextStyles({
            ...textStyles,
            [keyStyle]: value,
          })
        );
      }else{
        dispatch(
          setStyles({
            ...styles,
            [keyStyle]: value,
          })
        );
      }

      if (transformerRef.current) {
        const selectedShapeIds = transformerRef.current
          .nodes()
          .map((node) => node.attrs.id);

        const updatedShapes = shapes.map((shape) =>
          selectedShapeIds.includes(shape.id) && ((from=="text" && shape.type == ShapeType.TEXT) || (from !=="text" && shape.type !== ShapeType.TEXT)) ? { ...shape, [keyStyle]: value } : shape

        );
        dispatch(setShapes(updatedShapes));

        if (roomId) {
          sendMessage({
            type: MessageTypes.CHANGE_SHAPE,
            id: roomId,
            userName,
            value: updatedShapes,
          });
        }
      }
    }
  };


  const saveChangeStyleToHistory = (
    from:string
  ) => {
    return (
      keyStyle: string,
      value: valueStyle,
      oldValue: valueStyle,
      setNewOldValue: (val: valueStyle) => void
    )=>{
      if (transformerRef.current && transformerRef.current.nodes().length > 0) {
        const operation: operation = {
          type: TypesHistoryOperation.CHANGE_STYLES,
          key:keyStyle,
          value: {
            newValue: value,
            oldValue,
          },
          ids: transformerRef.current.nodes().map((node) => ((from=="text" && node.attrs.type == ShapeType.TEXT) || (from !=="text" && node.attrs.type !== ShapeType.TEXT))? node.attrs.id : null),
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
        setNewOldValue(value);
      }
    }
  };

  return {saveChangeStyleToHistory,onChangeStyleHandler}
}

export default useStylesBar