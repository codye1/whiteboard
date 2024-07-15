import { Node, NodeConfig } from 'konva/lib/Node';

const getRelativeClientRect = (node: Node<NodeConfig>) => {
  const stage = node.getStage();
  if (stage) {
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const nodeRect = node.getClientRect();

    const topLeft = transform.point({
      x: nodeRect.x,
      y: nodeRect.y,
    });

    const bottomRight = transform.point({
      x: nodeRect.x + nodeRect.width,
      y: nodeRect.y + nodeRect.height,
    });

    return {
      ...topLeft,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    };
  }
};

export default getRelativeClientRect;
