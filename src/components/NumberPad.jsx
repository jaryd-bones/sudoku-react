import { Button } from "react-bootstrap";

const NumberPad = ({ onNumber, disabled }) => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad mt-3">
      {nums.map((n) => (
        <Button
          key={n}
          variant="outline-primary"
          onClick={() => onNumber?.(n)}
          disabled={disabled}
        >
          {n}
        </Button>
      ))}
    </div>
  );
}

export default NumberPad;