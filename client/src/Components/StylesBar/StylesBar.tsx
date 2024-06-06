import { Dispatch, FC,MutableRefObject,} from 'react';
import { Shape, ShapeStyles, TOOLS } from '../../types/index';
import InputChangeColor from './Components/InputChangeColor';
import InputChangeNumber from './Components/InputChangeNumber';
import InputRange from './Components/InputRange';
import InputChangeTwoNumber from './Components/InputChangeTwoNumber';
import InputCheckBox from './Components/InputCheckBox';


interface IStylesBar{
    setStyles:Dispatch<React.SetStateAction<ShapeStyles>>
    styles:ShapeStyles
    tool:TOOLS
    selectedShape:MutableRefObject<Shape | null>
}

const StylesBar: FC<IStylesBar> = ({ styles, setStyles, tool ,selectedShape}) => {


    //const {styles,setStyles} = canvasStore

    if ((tool == TOOLS.CURSOR && !selectedShape.current) || tool == TOOLS.HAND) return null;

    return (
        <menu className='fixed top-10 left-1 rounded-[6px] bg-black z-20 p-2'>
            <div className='flex flex-col'>
                <InputChangeColor
                    title='Обводка'
                    inputId='strokeColor'
                    value={styles.stroke}
                    onChange={(event)=>{
                        setStyles(value => ({
                            ...value,
                            stroke: event.target.value
                        }));
                    }}
                    onClick={()=>{
                        setStyles(value => ({
                            ...value,
                            stroke: "transparent"
                        }));
                    }}
                    />
                <InputChangeColor
                    title='Фон'
                    inputId='fillColor'
                    value={styles.fill}
                    onChange={(event)=>{
                        setStyles(value => ({
                            ...value,
                            fill: event.target.value
                        }));
                    }}
                    onClick={()=>{
                        setStyles(value => ({
                            ...value,
                            fill: "transparent"
                        }));
                    }}
                    />
                <InputChangeNumber
                    title='Товщина обводки'
                    inputId='strokeWidth'
                    value={styles.strokeWidth}
                    onChange={(event)=>{
                        event.preventDefault();
                            setStyles(value => ({
                                ...value,
                                strokeWidth: parseInt(event.target.value)
                            }));
                    }}
                />
                <InputChangeNumber
                    title='Радіус угла'
                    inputId='cornerRadius'
                    value={styles.cornerRadius}
                    onChange={(event)=>{
                        event.preventDefault();
                            setStyles(value => ({
                                ...value,
                                cornerRadius: parseInt(event.target.value)
                            }));
                    }}
                />
                <InputRange
                    title='Прозорість'
                    inputId='opacity'
                    max={100}
                    min={0}
                    value={styles.opacity * 100}
                    onChange={(event)=>{
                        event.preventDefault();
                        setStyles(value => ({
                            ...value,
                            opacity: parseInt(event.target.value) * 0.01
                        }));
                    }}
                />
                <InputCheckBox
                    title='Тінь'
                    inputId="shadow"
                    value={selectedShape.current?.shadow}
                    onChange={(event)=>{
                        if (selectedShape.current) {
                            selectedShape.current.shadow = event.target.checked
                        }
                        if (selectedShape.current) {
                            selectedShape.current.shadow = event.target.checked
                        }

                        setStyles(value => ({
                            ...value,
                            shadowBlur: event.target.checked ? 10 : 0,
                            shadowOffset: event.target.checked ? value.shadowOffset : { x: 0, y: 0 }
                        }));
                    }}
                />
                {selectedShape.current?.shadow &&
                    <>
                        <InputChangeColor
                            title='Колір тіні'
                            inputId='shadowColor'
                            value={styles.shadowColor}
                            onChange={(event)=>{
                                setStyles(value => ({
                                    ...value,
                                    shadowColor: event.target.value
                                }));
                            }}
                            onClick={()=>{
                                setStyles(value => ({
                                    ...value,
                                    shadowColor: "transparent"
                                }));
                            }}
                        />
                        <InputChangeTwoNumber
                            title='Зсув тіні'
                            inputId='shadowOffset'
                            value={styles.shadowOffset}
                            onChange1={(event)=>{
                                event.preventDefault();
                                    setStyles(value => ({
                                        ...value,
                                        shadowOffset: {
                                            ...value.shadowOffset,
                                            x: parseInt(event.target.value)
                                        }
                                    }));
                            }}
                            onChange2={(event)=>{
                                event.preventDefault();
                                    setStyles(value => ({
                                        ...value,
                                        shadowOffset: {
                                            ...value.shadowOffset,
                                            y: parseInt(event.target.value)
                                        }
                                    }));
                            }}
                        />
                        <InputChangeNumber
                            title='Розмиття тіні'
                            inputId='shadowBlur'
                            value={styles.shadowBlur}
                            onChange={(event)=>{
                                event.preventDefault();
                                setStyles(value => ({
                                    ...value,
                                    shadowBlur: parseInt(event.target.value)
                                }));
                            }}
                        />
                        <InputRange
                            title='Прозорість тіні'
                            inputId='shadowOpacity'
                            max={100}
                            min={0}
                            value={styles.shadowOpacity * 100}
                            onChange={(event)=>{
                                event.preventDefault();
                                setStyles(value => ({
                                    ...value,
                                    shadowOpacity: parseInt(event.target.value) * 0.01
                                }));
                            }}
                        />
                    </>
                }
            </div>
        </menu>
    );
};

export default StylesBar;
