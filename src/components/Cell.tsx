import React, { useRef, useEffect } from 'react';
import { CellData } from '../utils/sudokuGenerator';

type CellProps = {
  value: CellData | null;
  row: number;
  col: number;
  onChange?: (row: number, col: number, value: number | null) => void;
  onSelect?: (row: number, col: number) => void;
  selectedValue?: number | null;
  selectedCells?: { row: number; col: number }[];
};

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

const Cell: React.FC<CellProps> = ({ value, row, col, onChange, onSelect, selectedValue, selectedCells }) => {
  const mobile = isMobile();
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
  if (selectedCells && selectedCells.length > 0) {
    const primaryCell = selectedCells[0];
    const sameRow = row === primaryCell.row;
    const sameCol = col === primaryCell.col;
    const sameBox = Math.floor(row / 3) === Math.floor(primaryCell.row / 3) && Math.floor(col / 3) === Math.floor(primaryCell.col / 3);
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
    if (selectedCells && selectedCells.length > 0 && selectedCells[0].row === row && selectedCells[0].col === col) {
      if (document.activeElement !== input) {
        input.focus();
      }
    } else {
      if (document.activeElement === input) {
        input.blur();
      }
    }
  }, [selectedCells, row, col]);

  const isSelected = selectedCells ? selectedCells.some(cell => cell.row === row && cell.col === col) : false;
  // helper to determine if a neighbor in a particular direction is selected
  const neighborAbove = selectedCells ? selectedCells.some(c => c.row === row - 1 && c.col === col) : false;
  const neighborBelow = selectedCells ? selectedCells.some(c => c.row === row + 1 && c.col === col) : false;
  const neighborLeft = selectedCells ? selectedCells.some(c => c.row === row && c.col === col - 1) : false;
  const neighborRight = selectedCells ? selectedCells.some(c => c.row === row && c.col === col + 1) : false;

  const borderTopStyle = isSelected
    ? neighborAbove
      ? '1px solid var(--grid-outline-color)'
      : '2.5px solid var(--grid-thick-outline-color)'
    : '1px solid var(--grid-outline-color)';
  const borderLeftStyle = isSelected
    ? neighborLeft
      ? '1px solid var(--grid-outline-color)'
      : '2.5px solid var(--grid-thick-outline-color)'
    : '1px solid var(--grid-outline-color)';
  const borderRightStyle = isSelected
    ? neighborRight
      ? '1px solid var(--grid-outline-color)'
      : '2.5px solid var(--grid-thick-outline-color)'
    : col === 8
      ? '1px solid var(--grid-outline-color)'
      : undefined;
  const borderBottomStyle = isSelected
    ? neighborBelow
      ? '1px solid var(--grid-outline-color)'
      : '2.5px solid var(--grid-thick-outline-color)'
    : row === 8
      ? '1px solid var(--grid-outline-color)'
      : undefined;

  const borderStyle: React.CSSProperties = {
    borderTop: borderTopStyle,
    borderLeft: borderLeftStyle,
    borderRight: borderRightStyle,
    borderBottom: borderBottomStyle,
    background: isHighlighted
      ? 'var(--cell-highlight-bg)'
      : isRelated && !isHighlighted
        ? 'var(--cell-related-bg)'
        : readOnly
          ? 'var(--cell-readonly-bg)'
          : 'var(--cell-bg)',
    fontSize: 'var(--sudoku-number-font-size)',
    width: '100%',
    height: '100%',
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    outline: isSelected && selectedCells && selectedCells.length === 1 ? '2.5px solid var(--grid-thick-outline-color)' : undefined,
    outlineOffset: isSelected && selectedCells && selectedCells.length === 1 ? '-2px' : undefined,
    zIndex: isSelected ? 2 : undefined,
    borderRadius: isSelected && selectedCells && selectedCells.length === 1 ? '4px' : undefined,
  };
  return (
    <div
      className="sudoku-cell"
      style={borderStyle}
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
          fontSize: 'var(--sudoku-note-font-size)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
            const highlightNote = selectedValue != null && value.notes.includes(n) && n === selectedValue;
            return (
              <span
                key={n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  margin: 0,
                  padding: 0,
                  opacity: value.notes.includes(n) ? 1 : 0,
                  fontWeight: highlightNote ? 'bold' : 500,
                  color: highlightNote ? 'var(--cell-note-highlight-color)' : 'var(--cell-note-color)',
                  boxSizing: 'border-box',
                  backgroundColor: highlightNote ? 'var(--cell-note-highlight)' : 'transparent',
                  borderRadius: highlightNote ? '5px' : '0',
                }}
              >
                {n}
              </span>
            );
          })}
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        id={`cell-${row}-${col}`}
        value={value?.value ?? ''}
        readOnly={readOnly || mobile}
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
          color: 'var(--cell-color)',
        }}
        aria-label="Sudoku cell"
        inputMode="numeric"
        pattern="[1-9]*"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};

export default Cell;
