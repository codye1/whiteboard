import { useState } from "react";
import undoLeft from "../../icons/footer/undo-left.svg"
import undoRight from "../../icons/footer/undo-right.svg"
import { Shape } from "../../types";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setShapes } from "../../reducers/canvas";


const Footer= () => {
    const [сanceledShapes, setсanceledShapes] = useState<Shape[]>([])
    const shapes = useAppSelector(state=>state.canvas.shapes)
    const dispatch = useAppDispatch()

    return (
        <footer className="absolute bottom-1 p-[10px]">
            <div className="bg-black rounded-[6px] flex ">
                <button onClick={()=>{
                    if (shapes.length>0) {
                        setсanceledShapes(сanceledShapes => сanceledShapes.concat(shapes[shapes.length-1]))
                        dispatch(setShapes(shapes.slice(0,-1)))
                    }
                }} className="p-[10px]" >
                    <img className={`w-[20px] h-[20px] ${shapes.length==0 && "opacity-25"}`} src={undoLeft} alt="" />
                </button>
                <button onClick={()=>{
                    if (сanceledShapes.length>0) {
                        dispatch(setShapes(shapes.concat(сanceledShapes[сanceledShapes.length-1])))
                        setсanceledShapes(сanceledShapes => сanceledShapes.slice(0,-1))
                    }
                }} className="p-[10px]" >
                    <img className={`w-[20px] h-[20px] ${сanceledShapes.length==0 && "opacity-25"}`} src={undoRight} alt="" />
                </button>
            </div>
        </footer>
    );
}

export default Footer;