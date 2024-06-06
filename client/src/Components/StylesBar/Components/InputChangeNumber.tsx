import { ChangeEvent, FC } from "react";

interface IInputChangeNumber{
    onChange:(event:ChangeEvent<HTMLInputElement>) => void
    title:string
    value:number
    inputId:string
}

const InputChangeNumber:FC<IInputChangeNumber> = ({title,value,inputId,onChange}) => {
    return (
        <>
            <label htmlFor={inputId} className={" text-white flex flex-col text-[14px]"}>
                {title}
            </label>
            <div className='flex items-center text-black'>
                <input
                    className=' max-w-[50px]'
                    id={inputId}
                    min={0}
                    value={value}
                    onChange={onChange}
                    type="number"
                />
            </div>
        </>
    );
};

export default InputChangeNumber;