import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import menu from '../../icons/menu.svg';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { clearCanvas } from '../../reducers/canvas';
import { Transformer } from 'konva/lib/shapes/Transformer';
import getRelativeClientRect from '../../helpers/getRealtiveClientRect';
import { saveAs } from 'file-saver';
import clear from '../../icons/menu/clear.svg';
import save from '../../icons/menu/save.svg';
import stats from '../../icons/menu/stats.svg';

interface IMenu {
  setStatsOpen: Dispatch<SetStateAction<boolean>>;
  transformerRef: MutableRefObject<Transformer | null>;
  statsOpen: boolean;
}

const Menu = ({ setStatsOpen, statsOpen, transformerRef }: IMenu) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { shapes } = useAppSelector((state) => state.canvas);

  useEffect(() => {
    const closePopover = () => {
      setPopoverOpen(false);
    };

    addEventListener('click', closePopover);
    addEventListener('wheel', closePopover);
    return () => {
      removeEventListener('click', closePopover);
      removeEventListener('wheel', closePopover);
    };
  }, []);

  const handleExport = () => {
    const stage = transformerRef.current?.getStage();
    if (!stage) {
      return;
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    shapes.forEach((shape) => {
      const node = stage.findOne(`#${shape.id}`);
      if (!node) {
        return;
      }
      const rect = getRelativeClientRect(node);
      if (rect) {
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
      }
    });

    if (
      minX === Infinity ||
      minY === Infinity ||
      maxX === -Infinity ||
      maxY === -Infinity
    ) {
      minX = minY = 0;
      maxX = stage.width();
      maxY = stage.height();
    }

    const oldScale = stage.scaleX();
    const oldPosition = stage.position();

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: -minX, y: -minY });

    const uri = stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: 1,
    });

    stage.scale({ x: oldScale, y: oldScale });
    stage.position(oldPosition);
    stage.batchDraw();

    // Создаем Blob из URI изображения
    fetch(uri)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], 'canvas.png', { type: 'image/png' });
        saveAs(file, 'canvas.png');
      });
  };

  return (
    <>
      <menu className="flex w-full justify-start ">
        <div className="mt-[10px] ml-[10px] z-30 fixed">
          <img
            src={menu}
            alt=""
            onClick={(event) => {
              event.stopPropagation();
              setPopoverOpen((value) => !value);
            }}
            className="w-[35px] h-[35px] cursor-pointer"
          />
          {popoverOpen && (
            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="popover bg-white shadow-lg mt-[5px] p-[5px] rounded border border-black"
            >
              <div
                onClick={() => {
                  setStatsOpen((value) => !value);
                }}
                className="popover-item cursor-pointer flex p-1 rounded hover:bg-gray-400 "
              >
                <img src={stats} alt="" className="w-[15px] mr-2" />
                Stats {statsOpen ? 'off' : 'on'}
              </div>
              <div
                onClick={() => {
                  localStorage.removeItem('canvas');
                  dispatch(clearCanvas());
                }}
                className="popover-item cursor-pointer flex p-1 rounded hover:bg-gray-400 "
              >
                <img src={clear} alt="" className="w-[15px] mr-2" />
                Clear canvas
              </div>
              <div
                onClick={() => {
                  handleExport();
                }}
                className="popover-item cursor-pointer flex p-1 rounded hover:bg-gray-400 "
              >
                <img src={save} alt="" className="w-[15px] mr-2" />
                Save stage
              </div>
            </div>
          )}
        </div>
      </menu>
    </>
  );
};

export default Menu;
