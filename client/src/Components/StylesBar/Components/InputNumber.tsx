import { MouseEvent } from 'react';

interface IInputNumber {
  increment: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  decrement: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  id: string;
  value: number;
}

const InputNumber = ({ increment, decrement, id, value }: IInputNumber) => {
  return (
    <>
      <button
        onClick={(event) => {
          decrement(event);
        }}
        className="text-white w-[25px] rounded-l-[5px] border border-white "
      >
        -
      </button>
      <input
        className=" max-w-[25px] text-center p-0 number bg-black text-white unded border  border-white"
        id={id}
        min={0}
        value={value}
        readOnly
        type="number"
      />
      <button
        onClick={(ev) => {
          increment(ev);
        }}
        className="text-white w-[25px] rounded-r-[5px] border  border-white"
      >
        +
      </button>
    </>
  );
};

export default InputNumber;
