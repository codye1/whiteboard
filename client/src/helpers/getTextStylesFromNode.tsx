import { Node } from 'konva/lib/Node';
import { CommonTextStyle } from '../types/shape';

const getTextStylesFromNode = (node: Node, styles: CommonTextStyle) => {
  const newStyles: CommonTextStyle = { ...styles };

  Object.keys(newStyles).forEach((key) => {
    const keyStyle = key as keyof CommonTextStyle;
    if (keyStyle in node.attrs) {
      newStyles[keyStyle] = node.attrs[keyStyle] as never;
    }
  });
  return newStyles;
};

export default getTextStylesFromNode;
