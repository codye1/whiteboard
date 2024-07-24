import { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  setModalWriteNameOpen,
  setName,
  setroomId,
} from '../../reducers/canvas';
import { useLocation } from 'react-router-dom';

interface IShareBoardModal {
  joinRoom: (roomId: string, userName: string) => void;
}

const ShareBoardModal: FC<IShareBoardModal> = ({ joinRoom }) => {
  const { roomId, userName } = useAppSelector((state) => state.canvas);
  const location = useLocation();
  console.log(location);

  const [name, setname] = useState(userName);
  const dispatch = useAppDispatch();

  return (
    <menu className="share-board-modal  flex w-full h-full absolute justify-center items-center">
      <div
        className="share-board-modal-container flex  bg-black opacity-75 w-full h-full fixed z-30 justify-center items-center"
        onClick={() => {
          dispatch(setModalWriteNameOpen(false));
        }}
      >
        <div
          className="bg-white p-[10px] rounded  border border-black"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="flex flex-col ">
            Write login
            <input
              type="text"
              className="border-solid border mt-2"
              value={name}
              onChange={(event) => {
                setname(event.target.value);
              }}
            />
          </div>
          <div className="flex justify-between">
            {roomId && location.pathname.length > 1 ? (
              <button
                className="m-auto mt-1"
                onClick={() => {
                  dispatch(setName(name));
                  dispatch(setModalWriteNameOpen(false));
                  joinRoom(roomId, name);
                }}
              >
                Connect
              </button>
            ) : (
              <button
                className="m-auto mt-1"
                onClick={() => {
                  dispatch(setName(name));
                  const roomId = (+new Date()).toString(16);
                  console.log((+new Date()).toString(16));

                  dispatch(setroomId(roomId));
                  joinRoom(roomId, name);
                  dispatch(setModalWriteNameOpen(false));
                }}
              >
                Create room
              </button>
            )}
            <button
              className="m-auto mt-1"
              onClick={() => {
                dispatch(setModalWriteNameOpen(false));
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </menu>
  );
};

export default ShareBoardModal;
