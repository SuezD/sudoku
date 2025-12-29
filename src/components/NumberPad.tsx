import React from "react";

type NumberPadProps = {
  onNumberClick: (num: number) => void;
  onPencilClick?: () => void;
  pencilMode?: boolean;
};

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onPencilClick, pencilMode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", width: '100%', gap: '0.5rem' }}>
    {numbers.map((num) => (
      <button
        key={num}
        onClick={() => onNumberClick(num)}
        style={{
          flex: 1,
          height: '100%',
          fontSize: '2em',
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
        flex: 1,
        height: '100%',
        fontSize: '1.7em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: "pointer",
        background: pencilMode ? '#cce6ff' : '',
        border: pencilMode ? '2px solid #3399ff' : '',
      }}
      aria-label="Pencil (notes)"
      title="Pencil (notes)"
    >
      ✏️
    </button>
  </div>
);

export default NumberPad;
