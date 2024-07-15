import ShareBoardModal from './ShareBoardModal';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setModalWriteNameOpen } from '../../reducers/canvas';
import { FC } from 'react';

interface IShareBoard {
  joinRoom: (roomId: string, userName: string) => void;
}

const ShareBoard: FC<IShareBoard> = ({ joinRoom }) => {
  const modalOpen = useAppSelector((state) => state.canvas.modalWriteNameOpen);
  const dispatch = useAppDispatch();

  return (
    <>
      <menu className="share-board  flex w-full justify-end">
        <div className="share-board-container flex  bg-black rounded-[6px] mt-[10px] mr-[10px] fixed  z-20">
          <button
            onClick={() => {
              dispatch(setModalWriteNameOpen(true));
            }}
            className="p-[10px] text-white h-[35px] flex items-center"
          >
            Share
          </button>
        </div>
      </menu>
      {modalOpen && <ShareBoardModal joinRoom={joinRoom} />}
    </>
  );
};

export default ShareBoard;
