import React from 'react';

type CellProps = {
  value: number | null;
  readOnly?: boolean;
  row: number;
  col: number;
  onChange?: (row: number, col: number, value: number | null) => void;
};

const Cell: React.FC<CellProps> = ({ value, readOnly = false, row, col, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange?.(row, col, null);
    } else if (/^[1-9]$/.test(val)) {
      onChange?.(row, col, parseInt(val, 10));
    }
  };

  return (
    <input
      type="text"
      value={value ?? ''}
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
