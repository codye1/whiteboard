import { ChangeEvent, FC,  MouseEventHandler, } from "react";
import transparent from "../../../icons/transparent.png"

interface IInputChangeColor{
    onChange:(event:ChangeEvent<HTMLInputElement>) => void,
    onClick: MouseEventHandler<HTMLImageElement>
    title:string
    value:string
    inputId:string
}

const InputChangeColor:FC<IInputChangeColor> = ({onChange,onClick,title,inputId,value}) => {



    return (
        <>
            <label htmlFor={inputId} className={" text-white flex flex-col text-[14px]"}>
                {title}
            </label>
            <div className='flex items-center'>
                <input
                    id={inputId}
                    onChange={onChange}
                    value={value}
                    type="color" />
                <img src={transparent} onClick={onClick} className='w-[20px] h-[20px] bg-white ml-2 cursor-pointer' alt="" />
                <div className='w-[1px] bg-white ml-2 h-[20px]'></div>
                {value == "transparent" ? <img src={transparent} className="w-[20px] h-[20px] ml-2 bg-white" alt="" /> : <div className={`w-[20px] h-[20px] ml-2`} style={{ backgroundColor: value }}></div>}
            </div>
        </>
    );
};

export default InputChangeColor;