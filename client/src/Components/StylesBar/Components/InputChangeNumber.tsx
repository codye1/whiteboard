import { FC, useEffect } from 'react';
import Placement2D from '../../../types/shape';
import { valueStyle } from '../../../types/history';
import InputNumber from './InputNumber';

interface IInputChangeNumber {
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
  title: string;
  value: number;
  keyStyle: string;
  inputId: string;
}

let oldValue: valueStyle;

const InputChangeNumber: FC<IInputChangeNumber> = ({
  title,
  value,
  inputId,
  onChangeHandler,
  saveChangeToHistory,
  keyStyle,
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
        {title}
      </label>
      <div className="flex items-center text-black m-1">
        <InputNumber
          id={inputId}
          value={value}
          decrement={() => {
            onChangeHandler(keyStyle, value - 1);
            saveChangeToHistory(keyStyle, value - 1, oldValue, (val) => {
              oldValue = val;
            });
          }}
          increment={() => {
            onChangeHandler(keyStyle, value + 1);
            saveChangeToHistory(keyStyle, value + 1, oldValue, (val) => {
              oldValue = val;
            });
          }}
        />
      </div>
    </>
  );
};

export default InputChangeNumber;
