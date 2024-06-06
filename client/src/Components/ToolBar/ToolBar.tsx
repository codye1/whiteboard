import hands from "../../icons/toolbar/hands.svg"
import cursor from "../../icons/toolbar/cursor.svg"
import line from "../../icons/toolbar/line.svg"
import rectangle from "../../icons/toolbar/rectangle.svg"
import circle from "../../icons/toolbar/circle.svg"
import brush from "../../icons/toolbar/brush.svg"
import { Dispatch, FC, } from "react"
import { TOOLS } from "../../types"


interface IToolBar{
    tool:string ,
    setTool:Dispatch<React.SetStateAction<TOOLS>>
}

const tools = [
    {
        icon:hands,
        tool:TOOLS.HAND
    },
    {
        icon:cursor,
        tool:TOOLS.CURSOR
    },
    {
        icon:line,
        tool:TOOLS.LINE
    },
    {
        icon:rectangle,
        tool:TOOLS.RECTANGLE
    },
    {
        icon:circle,
        tool:TOOLS.CIRCLE
    },
    {
        icon:brush,
        tool:TOOLS.BRUSH
    }
]

const ToolBar:FC<IToolBar> = ({tool,setTool}) => {

    return (
        <menu className="toolbar  flex w-full justify-center">
            <div className="toolbar-container flex  bg-black rounded-[6px] mt-[10px] fixed  z-20">
                {tools.map((t,index)=>
                    <div key={index} onClick={()=>{setTool(t.tool)}} className={`tool p-[5px] !important cursor-pointer hover:opacity-25 ${tool == t.tool && "opacity-25"}`}>
                        <img className="w-[15px] h-[15px] m-[5px]" src={t.icon}  alt="" />
                    </div>
                    )}
            </div>
        </menu>
    );
};

export default ToolBar;