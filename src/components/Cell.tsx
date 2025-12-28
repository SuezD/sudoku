import React from 'react';
import { CellData } from '../utils/sudoku-generator';

type CellProps = {
  value: CellData | null;
  row: number;
  col: number;
  pencilMode?: boolean;
  onChange?: (row: number, col: number, value: number | null) => void;
};

const Cell: React.FC<CellProps> = ({ value, row, col, pencilMode, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange?.(row, col, null);
    } else if (/^[1-9]$/.test(val)) {
      onChange?.(row, col, parseInt(val, 10));
    }
  };

  const readOnly = value?.isInitial ?? false;

  return (
    <input
      type="text"
      value={value?.value ?? ''}
      readOnly={readOnly}
      maxLength={1}
      onChange={handleChange}
      style={{
        caretColor: 'transparent',
        width: '2em',
        height: '2em',
        textAlign: 'center',
        fontSize: '1.5em',
        border: '1px solid #ccc',
        background: readOnly ? '#eee' : '#fff',
        cursor: readOnly ? 'default' : 'pointer',
        fontWeight: readOnly ? 'bold' : 'normal',
      }}
      aria-label="Sudoku cell"
      inputMode="numeric"
      pattern="[1-9]*"
    />
  );
};

export default Cell;
