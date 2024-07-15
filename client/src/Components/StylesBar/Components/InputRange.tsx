import { FC, useEffect } from 'react';
import { valueStyle } from '../../../types/history';
import Placement2D from '../../../types/shape';

interface IInputRange {
  onChangeHandler: (keyStyle: string, value: string | number | Placement2D) => void;
  saveChangeToHistory: (
    keyStyle: string,
    value: valueStyle,
    oldValue: valueStyle,
    setNewOldValue: (val: valueStyle) => void
  ) => void;
  title: string;
  value: number;
  max: number;
  min: number;
  inputId: string;
  keyStyle:string
}

let oldValue: valueStyle;

const InputRange: FC<IInputRange> = ({
  onChangeHandler,
  saveChangeToHistory,
  title,
  value,
  inputId,
  min,
  max,
  keyStyle
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
      <div className="flex items-center text-black">
        <input
          min={min}
          max={max}
          step={10}
          id={inputId}
          value={value}
          onChange={(event) => {
            onChangeHandler(keyStyle, parseInt(event.target.value) * 0.01);
            saveChangeToHistory(
              keyStyle,
              parseInt(event.target.value) * 0.01,
              oldValue,
              (val) => {
                oldValue = val;
              }
            );
          }}
          type="range"
        />
      </div>
    </>
  );
};

export default InputRange;
