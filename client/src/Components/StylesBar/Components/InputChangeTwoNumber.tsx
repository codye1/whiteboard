import { ChangeEvent, FC } from "react";


interface IInputChangeTwoNumber{
    onChange1:(event:ChangeEvent<HTMLInputElement>) => void
    onChange2:(event:ChangeEvent<HTMLInputElement>) => void
    title:string
    value:{x:number,y:number}
    inputId:string
}

const InputChangeTwoNumber:FC<IInputChangeTwoNumber> = ({onChange1,onChange2,title,value,inputId}) => {
    return (
        <>
            <label htmlFor={inputId} className={" text-white flex flex-col text-[14px]"}>
                {title}
            </label>
            <div className='flex items-center text-black'>
                <h1 className='text-white mr-1'>X: </h1>
                <input
                    className=' max-w-[50px] mr-2'
                    min={0}
                    value={value.x}
                    onChange={onChange1}
                    id={inputId}
                    type="number"
                    />

                <h1 className='text-white '>Y: </h1>
                <input
                    className='ml-1 max-w-[50px]'
                    min={0}
                    value={value.y}
                    onChange={onChange2}
                    id={inputId}
                    type="number"
                />
            </div>
        </>
    );
};

export default InputChangeTwoNumber;