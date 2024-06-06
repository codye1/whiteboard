/*
import { makeAutoObservable } from "mobx"
import { Shape, ShapeStyles } from "../types"

export const defaultStyles: ShapeStyles = {
    fill:"#9a8437",
    stroke:"#9a8437",
    tension:0.05,
    lineCap:"round",
    lineJoin:"round",
    strokeWidth:10,
    cornerRadius:0,
    opacity:1,
    shadowColor:"transparent",
    shadowBlur:0,
    shadowOffset: {x:0,y:0},
    shadowOpacity: 0.5
}

class canvasStore{
    shapes: Shape[] = []
    styles: ShapeStyles = {...defaultStyles}

    constructor() {
        makeAutoObservable(this)
    }

    setShapes = (shapes: Shape[]) => {
        this.shapes = shapes
    }

    setStyles = (styles: ShapeStyles) =>{
        this.styles = styles
    }

}



export default new canvasStore()
*/