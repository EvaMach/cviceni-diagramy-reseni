import { Box } from "../../model";

interface Props {
  from: Box;
  to: Box;
}

const ConnectionView = ({ from, to }: Props): JSX.Element => {
  return (
    <line
      x1={from.posX + from.width / 2}
      y1={from.posY + from.height / 2}
      x2={to.posX + to.width / 2}
      y2={to.posY + to.height / 2}
      stroke="white"
      strokeWidth="2"
    />
  );
};

export default ConnectionView;