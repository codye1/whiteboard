import { ChangeEvent, FC } from 'react';

interface IInputCheckBox {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  value: boolean | undefined;
  inputId: string;
}

const InputCheckBox: FC<IInputCheckBox> = ({
  onChange,
  title,
  value,
  inputId,
}) => {
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
          className="h-[25px] w-[30px]"
          id={inputId}
          type="checkbox"
          checked={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default InputCheckBox;
