import { FC, useEffect } from 'react';
import Placement2D from '../../../types/shape';
import { valueStyle } from '../../../types/history';

interface IInputChangeNumber {
  onChangeHandler: (keyStyle: string, value: string | number | Placement2D) => void;
  saveChangeToHistory: (
    keyStyle: string,
    value: valueStyle,
    oldValue: valueStyle,
    setNewOldValue: (val: valueStyle) => void
  ) => void;
  title: string;
  value: number;
  keyStyle:string
  inputId: string;
}

let oldValue: valueStyle;

const InputChangeNumber: FC<IInputChangeNumber> = ({
  title,
  value,
  inputId,
  onChangeHandler,
  saveChangeToHistory,
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
          className=" max-w-[50px]"
          id={inputId}
          min={0}
          value={value}
          onChange={(event) => {
            onChangeHandler(keyStyle, parseInt(event.target.value));
            saveChangeToHistory(
              keyStyle,
              parseInt(event.target.value),
              oldValue,
              (val) => {
                oldValue = val;
              }
            );
          }}
          type="number"
        />
      </div>
    </>
  );
};

export default InputChangeNumber;
