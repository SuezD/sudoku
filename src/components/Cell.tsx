import React, { useRef, useEffect } from 'react';
import { CellData } from '../utils/sudokuGenerator';

type CellProps = {
  value: CellData | null;
  row: number;
  col: number;
  onChange?: (row: number, col: number, value: number | null) => void;
  onSelect?: (row: number, col: number) => void;
  selectedValue?: number | null;
  selectedCell?: { row: number; col: number } | null;
};

const Cell: React.FC<CellProps> = ({ value, row, col, onChange, onSelect, selectedValue, selectedCell }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const match = val==='' ? null : val[val.length-1].match(/[1-9]/g);

    if (val==='') {
      onChange?.(row, col, null);
    } else if (match) {
      const newDigit = Number(match[match.length - 1]);
      onChange?.(row, col, newDigit);
    }
  };

  const readOnly = value?.isInitial ?? false;

  const isHighlighted = selectedValue != null && value?.value != null && value.value === selectedValue;
  let isRelated = false;
  if (selectedCell) {
    const sameRow = row === selectedCell.row;
    const sameCol = col === selectedCell.col;
    const sameBox = Math.floor(row / 3) === Math.floor(selectedCell.row / 3) && Math.floor(col / 3) === Math.floor(selectedCell.col / 3);
    isRelated = sameRow || sameCol || sameBox;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('togglePencilMode');
        window.dispatchEvent(event);
      }
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      if (document.activeElement !== input) {
        input.focus();
      }
    } else {
      if (document.activeElement === input) {
        input.blur();
      }
    }
  }, [selectedCell, row, col]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        background: isHighlighted
          ? '#fff066ff'
          : isRelated && !isHighlighted
            ? '#e0f7fa'
            : readOnly
              ? '#eee'
              : '#fff',
        fontSize: '2em',
        position: 'relative',
        boxSizing: 'border-box',
      }}
      onClick={() => onSelect?.(row, col)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
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
        ref={inputRef}
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
