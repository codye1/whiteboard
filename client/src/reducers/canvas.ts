import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Shape, ShapeStyles } from '../types'

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

interface ICanvas {
  shapes: Shape[]
  styles: ShapeStyles
}

const initialState: ICanvas = {
    shapes: [],
    styles: defaultStyles
}


const canvas = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setShapes(state, action: PayloadAction<Shape[]>) {
      state.shapes = action.payload
    },
    setStyles(state, action: PayloadAction<ShapeStyles>) {
        state.styles = action.payload
    },
  },
})

export const {  setShapes,setStyles } = canvas.actions

export default canvas;