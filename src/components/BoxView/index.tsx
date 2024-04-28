import { MouseEvent, Ref } from "react";

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  fill: string;
  label: string;
  onClick: (event: MouseEvent<SVGElement>) => void;
  boxRef: Ref<SVGTextElement>;
  isSelected: boolean;
}

const BoxView = ({ label, posX, fill, height, posY, width, onClick, boxRef, isSelected }: Props): JSX.Element => {
  return (
    <g onClick={onClick}>
      <rect
        x={posX}
        y={posY}
        rx="5"
        ry="5"
        width={width}
        height={height}
        fill={fill}
        stroke={isSelected ? 'black' : 'white'}
        strokeWidth="2"
        style={{ cursor: "pointer" }}
      />
      <text
        className="label"
        ref={isSelected ? boxRef : undefined}
        x={posX + width / 2}
        y={posY + height / 2}
        textAnchor="middle"
        alignmentBaseline="central"
        style={{ cursor: "pointer" }}
      >
        {label}
      </text>
    </g>
  );
};

export default BoxView;