import { valueStyle } from "../../../types/history";
interface defaultButton{
  src:string
  value:valueStyle
}

interface IRadioButtons{
  onChangeHandler: (keyStyle: string, value: valueStyle) => void;
  saveChangeToHistory: (
    keyStyle: string,
    value: valueStyle,
    oldValue: valueStyle,
    setNewOldValue: (val: valueStyle) => void
  ) => void;
  keyStyle:string
  value: string;
  buttons:defaultButton[]
}

const RadioButtons = ({onChangeHandler,saveChangeToHistory,value,keyStyle,buttons}:IRadioButtons) => {


  return (
      <fieldset className='flex justify-between'>
        {buttons.map((button,index)=>
          <div key={index} className="mt-2 mb-2">
            <input type="radio" className="hidden" id={button.value?.toString()} name={keyStyle} value={button.value?.toString()}
              onChange={(ev)=>{
                saveChangeToHistory(keyStyle,ev.target.value,value,()=>{})
                onChangeHandler(keyStyle,ev.target.value)
              }}
            />
            <label htmlFor={button.value?.toString()}>
              <img  alt="" className={`w-[30px] cursor-pointer rounded ${value==button.value? "border  border-white" : "hover:border hover:border-white "}`} src={button.src}/>
            </label>
          </div>
        )}
      </fieldset>
  );
};

export default RadioButtons;

/*
<img onClick={()=>{
          onChangeHandler("align","left")
          saveChangeToHistory("align","left",oldValue,()=>{oldValue="left"})
        }} className={`w-[30px] cursor-pointer rounded ${value=="left"? "border  border-white" : "hover:border hover:border-white "}`} src={leftAlign} alt="" />
         */

/*
<input type="radio" id={button.value?.toString()} name={keyStyle} checked={button.value?.toString()==value} onChange={()=>{

            }}/>
            <label htmlFor={button.value?.toString()}>
              <img alt="" className={`w-[30px] cursor-pointer rounded ${value==button.value? "border  border-white" : "hover:border hover:border-white "}`} src={button.src} />
            </label>*/