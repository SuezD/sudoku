import React from "react";

type NumberPadProps = {
  onNumberClick: (num: number) => void;
  onErase?: () => void;
  onPencilClick?: () => void;
};

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onErase, onPencilClick }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 40px)", gap: "8px" }}>
    {numbers.map((num) => (
      <button
        key={num}
        onClick={() => onNumberClick(num)}
        style={{
          width: 40,
          height: 40,
          fontSize: 18,
          cursor: "pointer",
        }}
        aria-label={`Number ${num}`}
      >
        {num}
      </button>
    ))}
    <button
      onClick={onPencilClick}
      style={{
        width: 40,
        height: 40,
        fontSize: 18,
        cursor: "pointer",
      }}
      aria-label="Pencil (notes)"
      title="Pencil (notes)"
    >
      ✏️
    </button>
  </div>
);

export default NumberPad;
