import { FC } from 'react';
import { Ellipse, Line, Rect, Text } from 'react-konva';
import { useAppSelector } from '../../hooks/hooks';
import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { message } from '../../types/message';
import { TOOLS, ShapeType } from '../../types/shape';
import useHandlers from './useHandlers';

interface IShapes {
  tool: TOOLS;
  sendMessage: (message: message) => void;
  transformerRef: React.MutableRefObject<Transformer>;
  openEditText: (
    mouseEvent: KonvaEventObject<MouseEvent>,
    isAddShape?: Node<NodeConfig>
  ) => void;
  isChange: React.MutableRefObject<boolean>;
}

const Shapes: FC<IShapes> = ({
  tool,
  sendMessage,
  transformerRef,
  openEditText,
  isChange,
}) => {
  const isDraggable = TOOLS.CURSOR == tool;
  const { shapes } = useAppSelector((state) => state.canvas);

  const handlers = useHandlers(sendMessage, transformerRef, isChange);

  return shapes.map((shape) => {
    const props = {
      draggable: isDraggable,
      ...handlers,
      onDblClick: openEditText,
      ...shape,
    };

    switch (shape.type) {
      case ShapeType.RECTANGLE:
        return <Rect key={shape.id} {...props} />;
      case ShapeType.CIRCLE:
        return (
          <Ellipse
            key={shape.id}
            {...props}
            {...shape}
            height={shape.radiusY * 2}
            width={shape.radiusX * 2}
          />
        );
      case ShapeType.LINE:
        return <Line key={shape.id} {...props} />;
      case ShapeType.TEXT:
        return <Text key={shape.id} {...props} />;
      default:
        break;
    }
  });
};

export default Shapes;
