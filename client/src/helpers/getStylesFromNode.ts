import { Node } from 'konva/lib/Node';
import { ShapeStyles } from '../types/shape';

const getStylesFromNode = (node: Node, styles: ShapeStyles) => {
  const newStyles: ShapeStyles = { ...styles };

  Object.keys(newStyles).forEach((key) => {
    const keyStyle = key as keyof ShapeStyles;
    if (keyStyle in node.attrs) {
      newStyles[keyStyle] = node.attrs[keyStyle] as never;
    }
  });
  return newStyles;
};

export default getStylesFromNode;
