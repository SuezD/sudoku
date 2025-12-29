import React from 'react';
import { CellData } from '../utils/sudokuGenerator';

type CellProps = {
  value: CellData | null;
  row: number;
  col: number;
  pencilMode?: boolean;
  onChange?: (row: number, col: number, value: number | null) => void;
};

const Cell: React.FC<CellProps> = ({ value, row, col, pencilMode, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const match = val.match(/[1-9]/g);

    if (!val || !match) {
      onChange?.(row, col, null);
    } else {
      const lastDigit = Number(match[match.length - 1]);
      onChange?.(row, col, lastDigit);
    }
  };

  const readOnly = value?.isInitial ?? false;

  return (
    <div
      style={{
        width: '2em',
        height: '2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        background: readOnly ? '#eee' : '#fff',
        fontSize: '1.5em',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {value?.notes && value?.notes.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          boxSizing: 'border-box',
          fontSize: '0.4em',
          color: '#888',
          pointerEvents: 'none',
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <div key={n} style={{ textAlign: 'center' }}>
              {value.notes.includes(n) ? n : ''}
            </div>
          ))}
        </div>
      )}
      <input
        type="text"
        id={`cell-${row}-${col}`}
        value={value?.value ?? ''}
        readOnly={readOnly}
        onChange={handleChange}
        style={{
          caretColor: 'transparent',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          padding: 0,
          margin: 0,
          textAlign: 'center',
          fontSize: '1em',
          border: 'none',
          background: 'transparent',
          cursor: readOnly ? 'default' : 'pointer',
          fontWeight: readOnly ? 'bold' : 'normal',
        }}
        aria-label="Sudoku cell"
        inputMode="numeric"
        pattern="[1-9]*"
        autoComplete="off"
      />
    </div>
  );
};

export default Cell;
