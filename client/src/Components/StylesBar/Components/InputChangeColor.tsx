import { FC } from 'react';
import transparent from '../../../icons/transparent.png';
import { valueStyle } from '../../../types/history';

interface IInputChangeColor {
  onChangeHandler: (keyStyle: string, value: valueStyle) => void;
  saveChangeToHistory: (
    keyStyle: string,
    value: valueStyle,
    oldValue: valueStyle,
    setNewOldValue: (val: valueStyle) => void
  ) => void;
  title: string;
  value: string;
  keyStyle: string;
  inputId: string;
}
let timer: ReturnType<typeof setTimeout>;

let oldValue: valueStyle;

const InputChangeColor: FC<IInputChangeColor> = ({
  onChangeHandler,
  title,
  inputId,
  value,
  saveChangeToHistory,
  keyStyle,
}) => {
  return (
    <>
      <label
        htmlFor={inputId}
        className={' text-white flex flex-col text-[14px]'}
      >
        {title}
      </label>
      <div className="flex items-center">
        <input
          id={inputId}
          onChange={(event) => {
            onChangeHandler(keyStyle, event.target.value);
            clearTimeout(timer);
            timer = setTimeout(() => {
              saveChangeToHistory(
                keyStyle,
                event.target.value,
                oldValue,
                (val) => {
                  oldValue = val;
                }
              );
            }, 100);
          }}
          onFocus={() => {
            oldValue = value;
          }}
          value={value}
          type="color"
        />
        <img
          src={transparent}
          onClick={() => {
            onChangeHandler(keyStyle, null);
            saveChangeToHistory(keyStyle, null, oldValue, (val) => {
              oldValue = val;
            });
          }}
          className="w-[20px] h-[20px] bg-white ml-2 cursor-pointer"
          alt=""
        />

        <div className="w-[1px] bg-white ml-2 h-[20px]"></div>

        {value == 'transparent' ? (
          <img
            src={transparent}
            className="w-[20px] h-[20px] ml-2 bg-white"
            alt=""
          />
        ) : (
          <div
            className={`w-[20px] h-[20px] ml-2`}
            style={{ backgroundColor: value }}
          ></div>
        )}
      </div>
    </>
  );
};

export default InputChangeColor;
