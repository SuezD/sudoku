import React from "react";

type NumberPadProps = {
  onChange: (row: number, col: number, value: number | null) => void;
  selectedCell: { row: number; col: number } | null;
  board: import('../utils/sudokuGenerator').CellData[][];
  onPencilClick?: () => void;
  pencilMode?: boolean;
};

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const NumberPad: React.FC<NumberPadProps> = ({ onChange, selectedCell, board, onPencilClick, pencilMode }) => {

  const handleNumberClick = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (board[row][col].isInitial) return;
    onChange(row, col, num);
  };

  const numberCounts = new Array(10).fill(0);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c].value;
      if (v && v >= 1 && v <= 9) numberCounts[v]++;
    }
  }

  return (
    <div className="numberpad-root" style={{ display: "flex", justifyContent: "space-between", width: '100%', gap: '0.2rem' }}>
      {numbers.map((num) => {
        const isFilled = numberCounts[num] >= 9;
        return (
          <button
            key={num}
            onMouseDown={e => e.preventDefault()}
            onClick={() => handleNumberClick(num)}
            style={{
              flex: 1,
              height: '3.5rem',
              minHeight: '2.5rem',
              fontSize: 'var(--sudoku-number-font-size)',
              fontWeight: 'bold',
              cursor: isFilled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              background: isFilled ? '#e0e0e0' : '',
              color: isFilled ? '#888' : '',
              opacity: isFilled ? 0.6 : 1,
            }}
            aria-label={`Number ${num}`}
          >
            {num}
          </button>
        );
      })}
      <button
        onClick={onPencilClick}
        style={{
          flex: 1,
          height: '3.5rem',
          minHeight: '2.5rem',
          fontSize: 'calc(var(--sudoku-number-font-size) * 0.85)',
          fontWeight: 'bold',
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
};

export default NumberPad;
