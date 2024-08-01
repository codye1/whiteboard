import { FC, MutableRefObject } from 'react';
import InputChangeColor from './Components/InputChangeColor';
import InputChangeNumber from './Components/InputChangeNumber';
import InputRange from './Components/InputRange';
import InputChangeTwoNumber from './Components/InputChangeTwoNumber';
import { useAppSelector } from '../../hooks/hooks';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { message } from '../../types/message';
import { TOOLS } from '../../types/shape';
import RadioButtons from './Components/RadioButtons';
import monospace from '../../icons/stylesbar/monospace.svg';
import cursive from '../../icons/stylesbar/cursive.svg';
import arial from '../../icons/stylesbar/arial.svg';
import centerAlign from '../../icons/stylesbar/centeralign.svg';
import leftAlign from '../../icons/stylesbar/leftalign.svg';
import rightAlign from '../../icons/stylesbar/rightalign.svg';
import { Node, NodeConfig } from 'konva/lib/Node';
import useStylesBar from './useStylesBar';

interface IStylesBar {
  tool: TOOLS;
  transformerRef: MutableRefObject<Transformer | null>;
  sendMessage: (message: message) => void;
  transformerHaveText: MutableRefObject<Node<NodeConfig> | null>;
}

const StylesBar: FC<IStylesBar> = ({
  tool,
  transformerRef,
  sendMessage,
  transformerHaveText,
}) => {
  const { styles, textStyles } = useAppSelector((state) => state.canvas);

  const { saveChangeStyleToHistory, onChangeStyleHandler } = useStylesBar(
    sendMessage,
    transformerRef
  );
  if (
    (tool == TOOLS.CURSOR &&
      transformerRef.current &&
      transformerRef.current.nodes().length == 0) ||
    tool == TOOLS.HAND
  )
    return null;

  return (
    <menu className="fixed top-[100px] left-1 rounded-[6px] bg-black z-20 p-2 flex-col">
      <div className="flex flex-col">
        {!(
          transformerHaveText.current &&
          transformerRef.current?.nodes().length == 1
        ) && (
          <>
            <h1 className="text-white">Shape style</h1>
            <InputChangeColor
              title="Stroke"
              inputId="strokeShape"
              keyStyle="stroke"
              value={styles.stroke}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <InputChangeColor
              title="Fill"
              inputId="fillShape"
              keyStyle="fill"
              value={styles.fill}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <InputChangeNumber
              title="Width stroke"
              inputId="strokeWidthShape"
              keyStyle="strokeWidth"
              value={styles.strokeWidth}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <InputChangeNumber
              title="Corner radius"
              inputId="cornerRadiusShape"
              keyStyle="cornerRadius"
              value={styles.cornerRadius}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <InputRange
              title="Opacity"
              inputId="opacityShape"
              keyStyle="opacity"
              max={100}
              min={0}
              value={styles.opacity * 100}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <h1 className="text-white">Shadow</h1>
            <InputChangeColor
              title="Color"
              inputId="shadowColor"
              keyStyle="shadowColor"
              value={styles.shadowColor}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <InputChangeTwoNumber
              mainTitle="Offset"
              titleOne="X"
              titleTwo="Y"
              inputId="shadowOffset"
              keyStyleOne="shadowOffsetX"
              keyStyleTwo="shadowOffsetY"
              value={{ x: styles.shadowOffsetX, y: styles.shadowOffsetY }}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <InputChangeNumber
              title="Blur"
              inputId="shadowBlur"
              keyStyle="shadowBlur"
              value={styles.shadowBlur}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
            <InputRange
              title="Opacity"
              inputId="shadowOpacity"
              keyStyle="shadowOpacity"
              max={100}
              min={0}
              value={styles.shadowOpacity * 100}
              onChangeHandler={onChangeStyleHandler('shape')}
              saveChangeToHistory={saveChangeStyleToHistory('shape')}
            />
          </>
        )}
      </div>
      {transformerHaveText.current && (
        <>
          <h1 className="text-white">Text style</h1>
          <RadioButtons
            value={textStyles.align}
            onChangeHandler={onChangeStyleHandler('text')}
            saveChangeToHistory={saveChangeStyleToHistory('text')}
            keyStyle="align"
            buttons={[
              {
                src: leftAlign,
                value: 'left',
              },
              {
                src: centerAlign,
                value: 'center',
              },
              {
                src: rightAlign,
                value: 'right',
              },
            ]}
          />
          <RadioButtons
            value={textStyles.fontFamily}
            onChangeHandler={onChangeStyleHandler('text')}
            saveChangeToHistory={saveChangeStyleToHistory('text')}
            keyStyle="fontFamily"
            buttons={[
              {
                src: monospace,
                value: 'monospace',
              },
              {
                src: cursive,
                value: 'cursive',
              },
              {
                src: arial,
                value: 'arial',
              },
            ]}
          />
          <InputChangeColor
            title="Fill"
            inputId="fillText"
            keyStyle="fill"
            value={textStyles.fill}
            onChangeHandler={onChangeStyleHandler('text')}
            saveChangeToHistory={saveChangeStyleToHistory('text')}
          />
          <InputChangeNumber
            title="Font size"
            inputId="fontSizeText"
            keyStyle="fontSize"
            value={textStyles.fontSize}
            onChangeHandler={onChangeStyleHandler('text')}
            saveChangeToHistory={saveChangeStyleToHistory('text')}
          />
          <InputRange
            title="Opasity"
            inputId="opacityText"
            keyStyle="opacity"
            max={100}
            min={0}
            value={textStyles.opacity * 100}
            onChangeHandler={onChangeStyleHandler('text')}
            saveChangeToHistory={saveChangeStyleToHistory('text')}
          />
        </>
      )}
    </menu>
  );
};

export default StylesBar;
