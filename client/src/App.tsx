import { Layer,  Rect,  Stage } from 'react-konva'
import './App.css'
import { useScale } from './hooks/useScale'
import ToolBar from './Components/ToolBar/ToolBar'
import Footer from './Components/Footer/Footer'
import useTool from './hooks/useTool'
import useMouseArea from './hooks/useMouseArea'
import {  TOOLS } from './types'
import Shapes from './Components/Shapes/Shapes'
import StylesBar from './Components/StylesBar/StylesBar'
import useSelect from './hooks/useSelect'
import canvasStore from './stores/canvasStore'
import { observer } from 'mobx-react-lite'



const App = observer(() => {
  const {onWheel, stagePos, stageScale} = useScale()
  const {tool,setTool} = useTool()
  const {shapes} = canvasStore

  /* const [shapes,setShapes ]= useState<Shape[]>([
    {
      type: ShapeType.RECTANGLE,
      id:"322",
      x:100,
      y:100,
      fill:"transparent",
      width:100,
      height:100,
      stroke:"black",
      strokeWidth:10,
      cornerRadius:0,
      opacity:1,
      shadowColor:"red",
      shadowBlur:10,
      shadowOffset: {x:10,y:10},
      shadowOpacity: 0.5
    }
  ])
*/

  const {onMouseDownHandlerArea,mouseMoveHandler,mouseUpHandler , previewLayer , selectedArea } = useMouseArea(tool)
  const {onMouseDownHandlerSelect,selectedShapeRef,mainLayer } = useSelect(previewLayer,tool,setTool,selectedArea)




  return (
    <main>
      <ToolBar tool={tool} setTool={setTool}/>
      <StylesBar tool={tool} selectedShape={selectedShapeRef}/>
    <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        draggable = {TOOLS.HAND == tool}
        onWheel={onWheel}
        {...stagePos}
        scale={{x:stageScale,y:stageScale}}
        onMouseDown={(event=>{
          onMouseDownHandlerArea(event)
          onMouseDownHandlerSelect(event)
        })}

        onMouseMove={mouseMoveHandler}
        onMouseUp={mouseUpHandler}
        >
        <Layer ref={mainLayer}>
          <Shapes tool={tool} shapes={shapes} />
        </Layer>
        <Layer ref={previewLayer}></Layer>
        <Layer>
          <Rect
            {...selectedArea}
            opacity={0.3}
            fill="aqua"
            stroke="blue"
            strokeWidth={1}
          />
        </Layer>
    </Stage>
    <Footer/>
    </main>
  )
})

export default App
