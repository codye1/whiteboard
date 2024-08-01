import Header from '../../Components/Header/Header';
import Canvas from '../../Components/Canvas/Canvas';
import useMain from './useMain';
import Footer from '../../Components/Footer/Footer';
const Main = () => {
  const { headerProps, canvasProps, footerProps } = useMain();

  return (
    <main>
      <Header {...headerProps} />
      <Canvas {...canvasProps} />
      <Footer {...footerProps} />
    </main>
  );
};

export default Main;

/*

    const shapes = useAppSelector(state=>state.canvas.shapes)
    const dispatch = useAppDispatch()

    const onDragEnd = ()=>{
        const newShapes = shapes.map((shape)=>{
            if (mainLayerRef.current) {
                const node = mainLayerRef.current.findOne(`#${shape.id}`)
                if (node) {
                    const pos = {x:node.x(),y:node.y()}
                    return {
                        ...shape,
                        ...pos
                    }
                }
            }
            return shape
        })
        dispatch(setShapes(newShapes))
    }
    */
