import { TOOLS } from '../../types/shape';
import {   Layer as KonvaLayer, Rect, Stage, } from 'react-konva';
import Shapes from '../Shapes/Shapes';
import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { Layer } from 'konva/lib/Layer';
import { MutableRefObject, useEffect, useState } from 'react';
import { message } from '../../types/message';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { ISelectedArea } from '../../hooks/useMouseArea';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { ICanvas as ICanvasReducer, initCanvas } from '../../reducers/canvas';
interface ICanvas {
  tool: TOOLS;
  isChange: MutableRefObject<boolean>;
  selectedArea: ISelectedArea;
  stagePos: {
    x: number;
    y: number;
  };
  onWheel: (e: KonvaEventObject<WheelEvent>) => void;
  onMouseDownHandlerArea: (event: KonvaEventObject<MouseEvent>) => void;
  mouseMoveHandler: (event: KonvaEventObject<MouseEvent>) => void;
  mouseUpHandler: (event: KonvaEventObject<MouseEvent>) => void;
  onMouseDownHandlerSelect: (event: KonvaEventObject<MouseEvent>) => void;
  sendMessage: (message: message) => void;
  openEditText: (
    mouseEvent: KonvaEventObject<MouseEvent>,
    isAddShape?: Node<NodeConfig>
  ) => void;
  stageScale: number;
  mainLayerRef: MutableRefObject<Layer | null>;
  previewLayerRef: MutableRefObject<Layer | null>;
  transformerRef: React.MutableRefObject<Transformer>;
}

const Canvas = ({
  tool,
  onWheel,
  stagePos,
  onMouseDownHandlerArea,
  onMouseDownHandlerSelect,
  mouseMoveHandler,
  mouseUpHandler,
  stageScale,
  mainLayerRef,
  previewLayerRef,
  transformerRef,
  sendMessage,
  openEditText,
  isChange,
  selectedArea,
}: ICanvas) => {


  const canvas = useAppSelector((state) => state.canvas);
  const [canvasInit, setCanvasInit] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const canvasData = localStorage.getItem('canvas');

    if (canvasData) {
      const canvas: ICanvasReducer = JSON.parse(canvasData);
      dispatch(initCanvas(canvas));
    }

    setCanvasInit(true);
  }, []);

  useEffect(() => {
    if (canvasInit) {
      localStorage.setItem('canvas', JSON.stringify(canvas));

    }
  }, [canvas]);


  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={TOOLS.HAND == tool}
      onWheel={onWheel}
      {...stagePos}
      scale={{ x: stageScale, y: stageScale }}
      onMouseDown={(event) => {
        onMouseDownHandlerArea(event);
        onMouseDownHandlerSelect(event);
      }}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
    >
      <KonvaLayer ref={mainLayerRef}>
        <Shapes
          tool={tool}
          sendMessage={sendMessage}
          transformerRef={transformerRef}
          openEditText={openEditText}
          isChange={isChange}
        />
      </KonvaLayer>
      <KonvaLayer ref={previewLayerRef}></KonvaLayer>
      <KonvaLayer>
        <Rect {...selectedArea} opacity={0.3} fill="aqua" strokeWidth={1} />
      </KonvaLayer>
    </Stage>
  );
};

export default Canvas;
