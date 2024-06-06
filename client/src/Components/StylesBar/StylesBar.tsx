import {  FC,MutableRefObject,} from 'react';
import { Shape,  TOOLS } from '../../types/index';
import InputChangeColor from './Components/InputChangeColor';
import InputChangeNumber from './Components/InputChangeNumber';
import InputRange from './Components/InputRange';
import InputChangeTwoNumber from './Components/InputChangeTwoNumber';
import InputCheckBox from './Components/InputCheckBox';
import canvasStore from '../../stores/canvasStore';


interface IStylesBar{
    tool:TOOLS
    selectedShape:MutableRefObject<Shape | null>
}

const StylesBar: FC<IStylesBar> = ({tool ,selectedShape}) => {


    const {styles,setStyles} = canvasStore

    if ((tool == TOOLS.CURSOR && !selectedShape.current) || tool == TOOLS.HAND) return null;

    return (
        <menu className='fixed top-10 left-1 rounded-[6px] bg-black z-20 p-2'>
            <div className='flex flex-col'>
                <InputChangeColor
                    title='Обводка'
                    inputId='strokeColor'
                    value={styles.stroke}
                    onChange={(event)=>{
                        setStyles({
                            ...styles,
                            stroke: event.target.value
                        });
                    }}
                    onClick={()=>{
                        setStyles({
                            ...styles,
                            stroke: "transparent"
                        });
                    }}
                    />
                <InputChangeColor
                    title='Фон'
                    inputId='fillColor'
                    value={styles.fill}
                    onChange={(event)=>{
                        setStyles({
                            ...styles,
                            fill: event.target.value
                        });
                    }}
                    onClick={()=>{
                        setStyles({
                            ...styles,
                            fill: "transparent"
                        });
                    }}
                    />
                <InputChangeNumber
                    title='Товщина обводки'
                    inputId='strokeWidth'
                    value={styles.strokeWidth}
                    onChange={(event)=>{
                        event.preventDefault();
                            setStyles({
                                ...styles,
                                strokeWidth: parseInt(event.target.value)
                            });
                    }}
                />
                <InputChangeNumber
                    title='Радіус угла'
                    inputId='cornerRadius'
                    value={styles.cornerRadius}
                    onChange={(event)=>{
                        event.preventDefault();
                            setStyles({
                                ...styles,
                                cornerRadius: parseInt(event.target.value)
                            });
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
                        setStyles({
                            ...styles,
                            opacity: parseInt(event.target.value) * 0.01
                        });
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

                        setStyles({
                            ...styles,
                            shadowBlur: event.target.checked ? 10 : 0,
                            shadowOffset: event.target.checked ? styles.shadowOffset : { x: 0, y: 0 }
                        });
                    }}
                />
                {selectedShape.current?.shadow &&
                    <>
                        <InputChangeColor
                            title='Колір тіні'
                            inputId='shadowColor'
                            value={styles.shadowColor}
                            onChange={(event)=>{
                                setStyles({
                                    ...styles,
                                    shadowColor: event.target.value
                                });
                            }}
                            onClick={()=>{
                                setStyles({
                                    ...styles,
                                    shadowColor: "transparent"
                                });
                            }}
                        />
                        <InputChangeTwoNumber
                            title='Зсув тіні'
                            inputId='shadowOffset'
                            value={styles.shadowOffset}
                            onChange1={(event)=>{
                                event.preventDefault();
                                    setStyles({
                                        ...styles,
                                        shadowOffset: {
                                            ...styles.shadowOffset,
                                            x: parseInt(event.target.value)
                                        }
                                    });
                            }}
                            onChange2={(event)=>{
                                event.preventDefault();
                                    setStyles({
                                        ...styles,
                                        shadowOffset: {
                                            ...styles.shadowOffset,
                                            y: parseInt(event.target.value)
                                        }
                                    });
                            }}
                        />
                        <InputChangeNumber
                            title='Розмиття тіні'
                            inputId='shadowBlur'
                            value={styles.shadowBlur}
                            onChange={(event)=>{
                                event.preventDefault();
                                setStyles({
                                    ...styles,
                                    shadowBlur: parseInt(event.target.value)
                                });
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
                                setStyles({
                                    ...styles,
                                    shadowOpacity: parseInt(event.target.value) * 0.01
                                });
                            }}
                        />
                    </>
                }
            </div>
        </menu>
    );
};

export default StylesBar;
