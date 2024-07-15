import undoLeft from '../../icons/footer/undo-left.svg';
import undoRight from '../../icons/footer/undo-right.svg';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { FC, MutableRefObject, useEffect } from 'react';
import { redo, undo } from '../../reducers/canvas';
import { MessageTypes, message } from '../../types/message';

interface IFooter {
  sendMessage: (message: message) => void;
  ctrlDownRef: MutableRefObject<boolean>;
}

const Footer: FC<IFooter> = ({ sendMessage, ctrlDownRef }) => {
  const { shapes, history, undoHistory, userName, roomId } = useAppSelector(
    (state) => state.canvas
  );

  const dispatch = useAppDispatch();

  const onUndoHandler = () => {
    if (history.length > 0) {
      dispatch(undo());
      if (roomId) {
        sendMessage({
          userName,
          id: roomId,
          type: MessageTypes.UNDO,
        });
      }
    }
  };

  const onRedoHandler = () => {
    if (undoHistory.length > 0) {
      dispatch(redo());
      if (roomId) {
        sendMessage({
          userName,
          id: roomId,
          type: MessageTypes.REDO,
        });
      }
    }
  };

  useEffect(() => {
    const keyDownHandler = (ev: KeyboardEvent) => {
      if (ev.key.toLowerCase() == 'z' && ctrlDownRef.current) {
        onUndoHandler();
      }
      if (
        (ev.key.toLowerCase() == 'y' && ctrlDownRef.current) ||
        ev.key == 'F4'
      ) {
        onRedoHandler();
      }
    };

    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [shapes]);

  return (
    <footer className="absolute bottom-1 p-[10px]">
      <div className="bg-black rounded-[6px] flex ">
        <button onClick={onUndoHandler} className="p-[10px]">
          <img
            className={`w-[20px] h-[20px] ${history.length == 0 && 'opacity-25'}`}
            src={undoLeft}
            alt=""
          />
        </button>
        <button onClick={onRedoHandler} className="p-[10px]">
          <img
            className={`w-[20px] h-[20px] ${undoHistory.length == 0 && 'opacity-25'}`}
            src={undoRight}
            alt=""
          />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
