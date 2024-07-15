import { FC, useEffect } from 'react';
import Placement2D from '../../../types/shape';
import { valueStyle } from '../../../types/history';

interface IInputChangeTwoNumber {
  onChangeHandler: (keyStyle: string, value: string | number | Placement2D) => void;
  saveChangeToHistory: (
    keyStyle: string,
    value: valueStyle,
    oldValue: valueStyle,
    setNewOldValue: (val: valueStyle) => void
  ) => void;
  mainTitle: string;
  value: { x: number; y: number };
  inputId: string;
  keyStyleOne:string
  keyStyleTwo:string
  titleOne:string
  titleTwo:string
}

let oldValue: valueStyle;

const InputChangeTwoNumber: FC<IInputChangeTwoNumber> = ({
  onChangeHandler,
  saveChangeToHistory,
  mainTitle,
  value,
  inputId,
  keyStyleOne,
  keyStyleTwo,
  titleOne,
  titleTwo
}) => {
  useEffect(() => {
    oldValue = value;
  }, []);

  return (
    <>
      <label
        htmlFor={inputId}
        className={' text-white flex flex-col text-[14px]'}
      >
        {mainTitle}
      </label>
      <div className="flex items-center text-black">
        <h1 className="text-white mr-1">{titleOne}</h1>
        <input
          className=" max-w-[50px] mr-2"
          min={0}
          value={value.x}
          onChange={(event) => {
            onChangeHandler(keyStyleOne, parseInt(event.target.value));
            saveChangeToHistory(
              keyStyleOne,
              parseInt(event.target.value),
              oldValue,
              (val) => {
                oldValue = val;
              }
            );
          }}
          id={inputId}
          type="number"
        />

        <h1 className="text-white ">{titleTwo}</h1>
        <input
          className="ml-1 max-w-[50px]"
          min={0}
          value={value.y}
          onChange={(event) => {
            onChangeHandler(keyStyleTwo, parseInt(event.target.value));
            saveChangeToHistory(
              keyStyleTwo,
              parseInt(event.target.value),
              oldValue,
              (val) => {
                oldValue = val;
              }
            );
          }}
          id={inputId + keyStyleTwo}
          type="number"
        />
      </div>
    </>
  );
};

export default InputChangeTwoNumber;
