import { useRef } from 'react';
import useEditText from '../../hooks/useEditText';
import useMouseArea from '../../hooks/useMouseArea';
import { useScale } from '../../hooks/useScale';
import useSelect from '../../hooks/useSelect';
import useTool from '../../hooks/useTool';
import useWebSocket from '../../hooks/useWebSoket';
import useRefs from '../../hooks/useRefs';

const useMain = () => {
  const {
    mainLayerRef,
    previewLayerRef,
    shapesRef,
    historyRef,
    undoHistoryRef,
    transformerRef,
  } = useRefs();
  const isChange = useRef(false);
  const { sendMessage, joinRoom } = useWebSocket(
    previewLayerRef,
    mainLayerRef,
    shapesRef,
    undoHistoryRef,
    historyRef
  );

  const { onWheel, stagePos, stageScale } = useScale();

  const { tool, setTool } = useTool();

  const openEditText = useEditText({
    transformerRef,
    tool,
    stageScale,
    shapesRef,
    sendMessage,
  });
  const {
    onMouseDownHandlerArea,
    mouseMoveHandler,
    mouseUpHandler,
    selectedArea,
  } = useMouseArea(tool, sendMessage, previewLayerRef, openEditText, setTool);

  const { onMouseDownHandlerSelect, ctrlDownRef, transformerHaveText } =
    useSelect(
      previewLayerRef,
      tool,
      setTool,
      selectedArea,
      mainLayerRef,
      sendMessage,
      shapesRef,
      transformerRef,
      isChange
    );

  const headerProps = {
    joinRoom,
    sendMessage,
    tool,
    setTool,
    transformerRef,
    transformerHaveText,
  };

  const canvasProps = {
    onMouseDownHandlerArea,
    onMouseDownHandlerSelect,
    onWheel,
    mouseUpHandler,
    mouseMoveHandler,
    openEditText,
    sendMessage,
    isChange,
    tool,
    selectedArea,
    previewLayerRef,
    mainLayerRef,
    transformerRef,
    stagePos,
    stageScale,
  };

  const footerProps = {
    sendMessage,
    ctrlDownRef,
  };

  return { headerProps, canvasProps, footerProps };
};

export default useMain;
