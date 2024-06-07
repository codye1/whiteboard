import { FC, } from "react";
import { ShapeType, TOOLS,} from "../../types";
import { Ellipse, Line, Rect } from "react-konva";
import { useAppSelector } from "../../hooks/hooks";

interface IShapes{
    tool:TOOLS,
}

const Shapes:FC<IShapes> = ({ tool }) => {

    const isDraggable = TOOLS.CURSOR == tool
    const shapes = useAppSelector(state=>state.canvas.shapes)

    return (
        shapes.map((shape)=>{
            switch (shape.type) {
                case ShapeType.RECTANGLE:
                    return (
                        <Rect
                            key={shape.id}
                            draggable={isDraggable}
                            {...shape}
                        />
                      )
                case ShapeType.CIRCLE:
                      return(
                        <Ellipse
                            key={shape.id}
                            draggable={isDraggable}
                            {...shape}
                            height={shape.radiusY*2}
                            width={shape.radiusX*2}
                        />
                      )
                case ShapeType.LINE:
                    console.log(shape);

                    return(
                        <Line
                            key={shape.id}
                            draggable={isDraggable}
                            {...shape}
                            x={0}
                            y={0}
                        />
                    )
                default:
                    break;
            }
        })
    );
}

export default Shapes;