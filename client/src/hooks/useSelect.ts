import { Dispatch, MutableRefObject, useEffect, useRef, useState } from "react";
import { ShapeStyles, Shape, TOOLS } from '../types/index';
import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { Layer } from "konva/lib/Layer";
import { ISelectedArea, initialMouseArea } from "./useMouseArea";
import { isShapeInSelection } from "../helpers/isShapeInSelection";


const useSelect = (previewLayer: MutableRefObject<Layer | null>,tool: TOOLS, setTool: Dispatch<React.SetStateAction<TOOLS>>, selectedArea: ISelectedArea , shapes:Shape[],setShapes:Dispatch<React.SetStateAction<Shape[]>>,styles:ShapeStyles,setStyles:Dispatch<React.SetStateAction<ShapeStyles>>) => {
    const selectedShapeRef = useRef<Shape | null>(null)
    const transformerRef = useRef(new Konva.Transformer())
    const [ctrlDown, setCtrlDown] = useState(false)
    const mouseDownRef = useRef(false)
    const selectedAreaRef = useRef<ISelectedArea>(selectedArea)
    const shapesRef = useRef<Shape[] | null>(shapes)
    const mainLayer = useRef<Layer | null>(null)
    const shapesInAreaRef = useRef<Shape[] | null>(null)



    function onMouseDownHandlerSelect(event: KonvaEventObject<MouseEvent>) {

        if (tool !== TOOLS.CURSOR) return
        shapesInAreaRef.current
        const stage = event.target.getStage()


        if (event.target == stage) {
            selectedAreaRef.current = initialMouseArea
            transformerRef.current.nodes([])
            shapesInAreaRef.current = []
            selectedShapeRef.current = null
            return
        }



        if (transformerRef.current.nodes().find(node=>node.attrs.id==event.target.attrs.id)) return

        if (previewLayer.current) {
            previewLayer.current.add(transformerRef.current)
        }

        selectedShapeRef.current = shapes.find((shape) => shape.id === event.target.attrs.id) || null;




        if (selectedShapeRef.current) {

            if (!ctrlDown) transformerRef.current.nodes([])

            const nodes = transformerRef.current.nodes()

            transformerRef.current.nodes([...nodes, event.target])
            const newStyles: ShapeStyles = { ...styles }

            if (transformerRef.current.nodes().length==1) {
                Object.keys(newStyles).forEach(key => {
                    const styleKey = key as keyof ShapeStyles
                    if (styleKey in event.target.attrs) {
                        newStyles[styleKey] = event.target.attrs[styleKey] as never
                    }
                })
                setStyles(newStyles)
            }
            if (previewLayer.current) {
                previewLayer.current.batchDraw()
            }
        }
    }

    useEffect(() => {
        if (selectedShapeRef.current && tool === TOOLS.CURSOR) {
            const updatedShapes = shapes.map((shape) =>
                shape.id === selectedShapeRef.current?.id
                    ? { ...shape, ...styles }
                    : shape
            );
            setShapes(updatedShapes);
        }
    }, [styles, setStyles])

    useEffect(() => {
        selectedShapeRef.current = null
        transformerRef.current.nodes([])
    }, [tool, setTool])

    useEffect(() => {
        selectedAreaRef.current = selectedArea; // Update ref when selectedArea changes
    }, [selectedArea])

    useEffect(() => {
        shapesRef.current = shapes;
    }, [shapes]);

    useEffect(() => {
        const handleCtrlDown = (e: KeyboardEvent) => {
            if (e.key === 'Control' && tool === TOOLS.CURSOR) {
                setCtrlDown(true)
            }
        }
        const handleCtrlUp = (e: KeyboardEvent) => {
            if (e.key === 'Control' && tool === TOOLS.CURSOR) {
                setCtrlDown(false)
            }
        }

        const handleMouseMove = () => {
            if ((!mouseDownRef.current || selectedShapeRef.current )&& tool !== TOOLS.CURSOR) {

                return
            }

            shapesInAreaRef.current = shapesRef.current?.filter((shape)=>{
                const node = mainLayer.current?.findOne(`#${shape.id}`)
                if (node) {
                 return isShapeInSelection(node.getClientRect(),selectedAreaRef.current)
                }
                return false
             }) || null


        }

        const handleMouseUp = () => {

            if (shapesInAreaRef.current && transformerRef.current.nodes().length==0) {
                selectedShapeRef.current = null

                const nodeShapes = shapesInAreaRef.current.map(shape => mainLayer.current?.findOne(`#${shape.id}`)).filter((node): node is Konva.Node => node !== undefined);


                transformerRef.current.nodes(nodeShapes)

                if (mainLayer.current) {
                    mainLayer.current.add(transformerRef.current)
                } else if (previewLayer.current) {
                    previewLayer.current.add(transformerRef.current)
                }

                transformerRef.current.getLayer()?.batchDraw()
            }
            mouseDownRef.current = false
        }

        const handleMouseDown = () => {
            mouseDownRef.current = true
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("keydown", handleCtrlDown)
        window.addEventListener("keyup", handleCtrlUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
            window.removeEventListener("keydown", handleCtrlDown)
            window.removeEventListener("keyup", handleCtrlUp)
        }
    }, [tool])

    return { onMouseDownHandlerSelect, selectedShapeRef, mainLayer }
};

export default useSelect;
