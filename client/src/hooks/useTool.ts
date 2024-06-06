import { useEffect, useState } from 'react';
import { TOOLS } from '../types';
import canvasStore, { defaultStyles } from '../stores/canvasStore';



const useTool = () => {
    const [tool,setTool] = useState<TOOLS>(TOOLS.CURSOR)
    const {setStyles} = canvasStore
    useEffect(()=>{
        setStyles(defaultStyles)
        const handleKeyPress = (event: globalThis.KeyboardEvent)=>{
            switch (event.key) {
                case "1":
                    document.body.style.cursor = "grab";
                    setTool(TOOLS.HAND)
                    break;
                case "2":
                    setTool(TOOLS.CURSOR)
                    document.body.style.cursor = "default"
                    break;
                case "3":
                    setTool(TOOLS.LINE)
                    document.body.style.cursor = "default"
                    break;
                case "4":
                    setTool(TOOLS.RECTANGLE)
                    document.body.style.cursor = "default"
                    break;
                case "5":
                    setTool(TOOLS.CIRCLE)
                    document.body.style.cursor = "default"
                    break;
                case "6":
                    setTool(TOOLS.BRUSH)
                    document.body.style.cursor = "default"
                    break;
                default:
                    break;
            }

        }



        const handleMouseDown = ()=>{
            if(tool==TOOLS.HAND)
                document.body.style.cursor = "grabbing";
            else document.body.style.cursor = "default"
        }

        const handleMouseUp = ()=>{
            if(tool==TOOLS.HAND)
                document.body.style.cursor = "grab";
            else document.body.style.cursor = "default"
        }

        window.addEventListener("mousedown",handleMouseDown)
        window.addEventListener("mouseup",handleMouseUp)
        window.addEventListener('keypress',handleKeyPress)

        return ()=>{
            window.removeEventListener("mousedown",handleMouseDown)
            window.removeEventListener("mouseup",handleMouseUp)
            window.removeEventListener('keypress',handleKeyPress)
        }
    },[tool])

    return {tool , setTool}
};

export default useTool;