import { Layer } from 'konva/lib/Layer';
import { useEffect, useRef } from 'react';
import { useAppSelector } from './hooks';
import { initialMouseArea } from './useMouseArea';
import Konva from 'konva';

const useRefs = () => {
  const canvas = useAppSelector((state) => state.canvas);
  const selectedAreaRef = useRef(initialMouseArea);
  const previewLayerRef = useRef<Layer | null>(null);
  const mainLayerRef = useRef<Layer | null>(null);
  const shapesRef = useRef(canvas.shapes);
  const historyRef = useRef(canvas.history);
  const undoHistoryRef = useRef(canvas.undoHistory);
  const transformerRef = useRef(
    new Konva.Transformer({
      name: 'transformer',
      anchorStroke: 'black',
      anchorFill: 'white',
      anchorSize: 10,
      borderStroke: 'black',
    })
  );

  useEffect(() => {
    shapesRef.current = canvas.shapes;
    console.log(canvas.shapes);
  }, [canvas.shapes]);

  useEffect(() => {
    historyRef.current = canvas.history;
    console.log('history');
  }, [canvas.history]);

  useEffect(() => {
    undoHistoryRef.current = canvas.undoHistory;
    console.log(canvas.undoHistory);
  }, [canvas.undoHistory]);

  return {
    mainLayerRef,
    previewLayerRef,
    shapesRef,
    selectedAreaRef,
    historyRef,
    undoHistoryRef,
    transformerRef,
  };
};

export default useRefs;
