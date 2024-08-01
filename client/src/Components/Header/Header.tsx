import ShareBoard from '../ShareBoard/ShareBoard';
import StylesBar from '../StylesBar/StylesBar';
import ToolBar from '../ToolBar/ToolBar';
import { TOOLS } from '../../types/shape';
import { message } from '../../types/message';
import { Dispatch, MutableRefObject, useState } from 'react';
import { Transformer } from 'konva/lib/shapes/Transformer';
import Menu from '../Menu/Menu';
import StatsComponent from '../StylesBar/Components/Stats';
import { Node, NodeConfig } from 'konva/lib/Node';

interface IHeader {
  joinRoom: (roomId: string, userName: string) => void;
  setTool: Dispatch<React.SetStateAction<TOOLS>>;
  tool: TOOLS;
  transformerRef: MutableRefObject<Transformer | null>;
  sendMessage: (message: message) => void;
  transformerHaveText: MutableRefObject<Node<NodeConfig> | null>;
}

const Header = ({
  joinRoom,
  setTool,
  tool,
  transformerRef,
  sendMessage,
  transformerHaveText,
}: IHeader) => {
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <>
      <Menu
        statsOpen={statsOpen}
        setStatsOpen={setStatsOpen}
        transformerRef={transformerRef}
      />
      <ShareBoard joinRoom={joinRoom} />
      <ToolBar tool={tool} setTool={setTool} />
      <StylesBar
        tool={tool}
        transformerRef={transformerRef}
        sendMessage={sendMessage}
        transformerHaveText={transformerHaveText}
      />
      {statsOpen && <StatsComponent />}
    </>
  );
};

export default Header;
