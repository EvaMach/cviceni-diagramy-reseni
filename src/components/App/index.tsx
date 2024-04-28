import { ChangeEvent, useEffect, MouseEvent, useRef, useState } from 'react';
import './styles.css';
import { Box, Connection, Diagram } from '../../model';
import BoxView from '../BoxView';
import ConnectionView from '../ConnectionView';

export const App = (): JSX.Element => {
  const [diagram, setDiagram] = useState<Diagram>({
    boxes: [],
    connections: [],
    id: 0,
    title: '',
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedBox = useRef<SVGTextElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect((): void => {
    const fetchBoxes = async (): Promise<void> => {
      const response = await fetch('http://localhost:4000/api/diagrams');
      const json = await response.json();
      const diagramData = json.data[0] as Diagram;
      setDiagram(diagramData);
    };
    void fetchBoxes();
  }, []);

  
  useEffect(() => {
    if (input.current !== null && selectedIndex !== null) {
      input.current.value = diagram.boxes[selectedIndex].label;
      input.current.focus();
      input.current.select();
    }
  }, [selectedIndex]);

  const handleClick = (event: MouseEvent<SVGElement>): void => {
    if (!event.ctrlKey) {
      setSelectedIndex(null);
      return;
    }

    const board = event.target as SVGElement;
    const newBox: Box = {
      fill: 'white',
      height: 40,
      width: 160,
      label: 'Nová položka',
      posX: event.clientX - board.getBoundingClientRect().x,
      posY: event.clientY - board.getBoundingClientRect().y,
    };
    setSelectedIndex(diagram.boxes.length);
    setDiagram({ ...diagram, boxes: [...diagram.boxes, newBox] });
  };

  const isExistingConnection = (from: number, to: number) => {
    return diagram.connections.some((connection) => {
      return (
        (connection.from === from && connection.to === to) ||
        (connection.to === from && connection.from === to)
      );
    });
  };

  const selectBox = (event: MouseEvent<SVGElement>, index: number): void => {
    event.stopPropagation();
    if (event.ctrlKey && selectedIndex !== null) {
      if (isExistingConnection(selectedIndex, index)) {
        setDiagram({
          ...diagram,
          connections: diagram.connections
            .filter((connection) => !(connection.from === index && connection.to === selectedIndex))
          });
          setSelectedIndex(index);
          return;
      }
      
      const newConnection: Connection = {
        from: selectedIndex,
        to: index
      }
      setDiagram({ ...diagram, connections: [...diagram.connections, newConnection] });
    }
    setSelectedIndex(index);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputField = event.target;
    if (selectedBox.current !== null) {
      selectedBox.current.innerHTML = inputField.value;
    }
  };

  if (diagram === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="layout">
      <header className="header">
        <h1>{diagram.title}</h1>
        <div className="label-field">
          <label htmlFor="box-label">Label:</label>
          <input ref={input} onChange={handleChange} type="text" id="box-label" disabled={selectedIndex === null} />
        </div>
      </header>
      <svg className='board' onClick={handleClick}>
        {diagram.connections.map((connection, index) => (
          <ConnectionView key={index} from={diagram.boxes[connection.from]} to={diagram.boxes[connection.to]} />
        ))}
        {diagram.boxes.map((box, index) => (
          <BoxView
            key={index}
            isSelected={selectedIndex === index}
            boxRef={selectedBox}
            onClick={(event: MouseEvent<SVGElement>): void => selectBox(event, index)}
            fill={box.fill}
            height={box.height}
            label={box.label}
            posX={box.posX}
            posY={box.posY}
            width={box.width}
          />
        ))}
      </svg>
    </div>
  );
};
