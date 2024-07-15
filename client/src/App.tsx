import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { setModalWriteNameOpen, setroomId } from './reducers/canvas';
import Main from './pages/Main/Main';

const App = () => {
  const { roomId } = useAppSelector((state) => state.canvas);
  const location = window.location;

  const dispatch = useAppDispatch();

  if (location.pathname !== '/' && !roomId) {
    dispatch(setModalWriteNameOpen(true));
    dispatch(setroomId(location.pathname.replace(/\//g, '')));
  }

  return (
    <BrowserRouter>
      <Routes>
        {roomId ? (
          <>
            <Route path="/:id" element={<Main />}></Route>
            <Route path="*" element={<Navigate to={`${roomId}`} />} />
          </>
        ) : (
          <>
            <Route path="" element={<Main />}></Route>
            <Route path="*" element={<Navigate to="" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

//<Route path='/:id' element={<Main/>}>
//<Route path="*" element={<Navigate to={`${(+new Date()).toString(16)}`} />} />

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
