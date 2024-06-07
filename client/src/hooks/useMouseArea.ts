import { KonvaEventObject } from 'konva/lib/Node';
import {  useRef, useState } from 'react';
import { getRelativePointerPosition } from '../helpers/getRelativeMousePosition';
import { Layer } from 'konva/lib/Layer';
import { Shape,  ShapeType, TOOLS } from '../types';
import { getNewSelectAreaSize } from '../helpers/getSizeArea';
import { shapeSizing } from '../helpers/shapeSizing';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from './hooks';
import { setShapes } from '../reducers/canvas';

export interface ISelectedArea{
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    startX: number;
    startY: number;
}

export const initialMouseArea:ISelectedArea = {
    visible: true,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    startX: 0,
    startY: 0,
  };


const useMouseArea = (tool:string) => {
    const mouseDown = useRef(false)
    const [selectedArea , setSelectedArea] = useState(initialMouseArea)
    const previewLayer = useRef<Layer | null>(null)
    const shapePreview = useRef<Shape | null>(null)
    const {shapes,styles} = useAppSelector(state=>state.canvas)
    const dispatch =useAppDispatch()
    const shape = shapePreview.current;
    const shapeToEdit = previewLayer.current?.findOne(`#${shape?.id}`)

    const  mouseMoveHandler = (event:KonvaEventObject<MouseEvent>) => {
        if (!mouseDown.current) return
        const stage = event.target.getStage()
        const pos = getRelativePointerPosition(stage)
        if (!pos) return

        const {height,width,x,y} =  getNewSelectAreaSize(pos,{
            x:selectedArea.startX,
            y: selectedArea.startY
        })



        if (TOOLS.CURSOR == tool) {
            const rectSelection = shapeSizing.getRectSize({height,width}, {x,y})
            setSelectedArea({...selectedArea,...rectSelection})
        }

        if(!shape || !shapeToEdit) return

        if (TOOLS.RECTANGLE == tool) {
            const rectSelection = shapeSizing.getRectSize({height,width}, {x,y})
            shapeToEdit.setAttrs(rectSelection)
            shapePreview.current = {...shape,...rectSelection}
        }



        if (TOOLS.CIRCLE == tool) {
            const circleSelection = shapeSizing.getEllipseSize({height,width},{x,y})
            shapeToEdit.setAttrs(circleSelection)
            shapePreview.current = {...shape,...circleSelection}
        }
        if (TOOLS.LINE == tool && shape.type == ShapeType.LINE) {
            shape.points[2] = pos.x
            shape.points[3] = pos.y

            shapeToEdit.setAttr("points", shape.points)
            shapePreview.current = {...shape , }
        }
        if (TOOLS.BRUSH == tool && shape.type == ShapeType.LINE) {
            const points = shape.points.concat([pos.x,pos.y])
            shape.points = points
            shapeToEdit.setAttr("points", points)
            shapePreview.current = {...shape , }
        }
        previewLayer.current?.batchDraw()
    }

    const  onMouseDownHandlerArea = (event:KonvaEventObject<MouseEvent>) => {
        if (tool == TOOLS.HAND) return
        const stage = event.target.getStage()
        const pos = getRelativePointerPosition(stage)
        if (!pos) return


        mouseDown.current = true

        if (stage) {
            setSelectedArea(area => ({...area,startX: pos.x , startY: pos.y} ) )
        }

        let shape: Shape | null = null
        const shapeId = uuidv4()

        if (tool == TOOLS.RECTANGLE) {
            shape = {
                type: ShapeType.RECTANGLE,
                id: shapeId,
                shadow:false,
                ...styles,
                ...selectedArea
            }
        }
        if(tool == TOOLS.CIRCLE){
            shape = {
                type: ShapeType.CIRCLE,
                id: shapeId,
                shadow:false,
                ...styles,
                radiusX: 0,
                radiusY: 0,
                width:0,
                height:0,
                ...pos
            }
        }
        if (tool == TOOLS.LINE) {
            shape = {
                type: ShapeType.LINE,
                id: shapeId,
                shadow:false,
                ...styles,
                ...pos,
                points:[pos.x, pos.y]
            }
        }
        if (tool == TOOLS.BRUSH) {
            shape = {
                type: ShapeType.LINE,
                id: shapeId,
                shadow:false,
                ...styles,
                ...pos,
                points:[pos.x, pos.y]
            }
        }


        if (!shape) return;

        shapePreview.current = shape

        switch(tool){
            case TOOLS.RECTANGLE:
                previewLayer.current?.add(new Konva.Rect(shape))
                break;
            case TOOLS.CIRCLE:
                previewLayer.current?.add(new Konva.Ellipse({...shape, radiusX:0 , radiusY:0 }))
                break;
            case TOOLS.LINE:
                previewLayer.current?.add(new Konva.Line({...shape , x:0 , y: 0 , width: 0}))
                break;
            case TOOLS.BRUSH:
                previewLayer.current?.add(new Konva.Line({...shape , x:0 , y: 0 , width: 0}))
                break;
        }
    }
    const  mouseUpHandler = () => {
        mouseDown.current = false
        if (tool != TOOLS.HAND && tool != TOOLS.CURSOR ) {
            const shape = shapePreview.current
            if(!shape) return
            const shapeToEdit = previewLayer.current?.findOne(`#${shape.id}`)
            shapeToEdit?.destroy()

            dispatch(setShapes([...shapes,shape]))
            shapePreview.current = null
        }
        setSelectedArea(initialMouseArea)
    }

    return {onMouseDownHandlerArea,mouseMoveHandler,mouseUpHandler , previewLayer , selectedArea }
};

export default useMouseArea;