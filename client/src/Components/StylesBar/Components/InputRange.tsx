import { ChangeEvent, FC } from "react";

interface IInputRange{
    onChange:(event:ChangeEvent<HTMLInputElement>) => void
    title:string
    value:number
    max:number
    min:number
    inputId:string
}


const InputRange:FC<IInputRange> = ({onChange,title,value,inputId,min,max}) => {
    return (
        <>
            <label htmlFor={inputId} className={" text-white flex flex-col text-[14px]"}>
                {title}
            </label>
            <div className='flex items-center text-black'>
                <input
                    min={min}
                    max={max}
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    type="range" />
            </div>
        </>
    );
};

export default InputRange;