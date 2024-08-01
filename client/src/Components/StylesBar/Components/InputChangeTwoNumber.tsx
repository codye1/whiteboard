import { FC, useEffect } from 'react';
import Placement2D from '../../../types/shape';
import { valueStyle } from '../../../types/history';
import InputNumber from './InputNumber';

interface IInputChangeTwoNumber {
  onChangeHandler: (
    keyStyle: string,
    value: string | number | Placement2D
  ) => void;
  saveChangeToHistory: (
    keyStyle: string,
    value: valueStyle,
    oldValue: valueStyle,
    setNewOldValue: (val: valueStyle) => void
  ) => void;
  mainTitle: string;
  value: { x: number; y: number };
  inputId: string;
  keyStyleOne: string;
  keyStyleTwo: string;
  titleOne: string;
  titleTwo: string;
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
  titleTwo,
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
      <div className=" items-center text-black table-column">
        <div className="flex">
          <h1 className="text-white mr-2">{titleOne}</h1>
          <InputNumber
            id={inputId}
            value={value.x}
            decrement={() => {
              onChangeHandler(keyStyleOne, value.x - 1);
              saveChangeToHistory(keyStyleOne, value.x - 1, oldValue, (val) => {
                oldValue = val;
              });
            }}
            increment={() => {
              onChangeHandler(keyStyleOne, value.x + 1);
              saveChangeToHistory(keyStyleOne, value.x + 1, oldValue, (val) => {
                oldValue = val;
              });
            }}
          />
        </div>
        <div className="flex mt-2">
          <h1 className="text-white  mr-2">{titleTwo}</h1>
          <InputNumber
            id={inputId}
            value={value.y}
            decrement={() => {
              onChangeHandler(keyStyleTwo, value.y - 1);
              saveChangeToHistory(keyStyleTwo, value.y - 1, oldValue, (val) => {
                oldValue = val;
              });
            }}
            increment={() => {
              onChangeHandler(keyStyleTwo, value.y + 1);
              saveChangeToHistory(keyStyleTwo, value.y + 1, oldValue, (val) => {
                oldValue = val;
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default InputChangeTwoNumber;
