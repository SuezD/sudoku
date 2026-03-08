import React, { useState, useRef } from 'react';
import { CellData } from '../utils/sudokuGenerator';
import Cell from './Cell';

type GameBoardProps = {
  board: CellData[][];
  onChange: (row: number, col: number, value: number | null) => void;
  onCellSelect: (row: number, col: number) => void;
  onCellDragStart?: (row: number, col: number) => void;
  onCellDrag?: (row: number, col: number) => void;
  onCellDragEnd?: () => void;
  selectedValue: number | null;
  selectedCells: { row: number; col: number }[];
};

const GameBoard: React.FC<GameBoardProps> = ({ board, onChange, onCellSelect, onCellDragStart, onCellDrag, onCellDragEnd, selectedValue, selectedCells }) => {
  const [isDragging, setIsDragging] = useState(false);
  const gameboardRef = useRef<HTMLDivElement>(null);

  const getCellFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = gameboardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cellSize = rect.width / 9;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < 9 && col >= 0 && col < 9) {
      return { row, col };
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const cell = getCellFromEvent(e);
    if (cell) {
      setIsDragging(true);
      onCellDragStart?.(cell.row, cell.col);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const cell = getCellFromEvent(e);
      if (cell) {
        onCellDrag?.(cell.row, cell.col);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onCellDragEnd?.();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const cell = getCellFromEvent(e);
    if (cell) {
      setIsDragging(true);
      onCellDragStart?.(cell.row, cell.col);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (cell) {
        onCellDrag?.(cell.row, cell.col);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      onCellDragEnd?.();
    }
  };
  return (
    <div className="gameboard-container" style={{position: 'relative'}}>
      <div 
        ref={gameboardRef}
        className="gameboard sudoku-grid" 
        style={{position: 'relative'}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {[1,2].map(i => (
          <div
            key={`vline-${i}`}
            style={{
              position: 'absolute',
              top: 0,
              left: `${(i*100/9*3).toFixed(4)}%`,
              width: '2.5px',
              height: '100%',
              background: 'var(--grid-thick-outline-color)',
              zIndex: 10,
              transform: 'translateX(-1.25px)',
              pointerEvents: 'none',
            }}
          />
        ))}
        {[1,2].map(i => (
          <div
            key={`hline-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              top: `${(i*100/9*3).toFixed(4)}%`,
              height: '2.5px',
              width: '100%',
              background: 'var(--grid-thick-outline-color)',
              zIndex: 10,
              transform: 'translateY(-1.25px)',
              pointerEvents: 'none',
            }}
          />
        ))}
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              value={cell}
              row={rowIdx}
              col={colIdx}
              onChange={onChange}
              onSelect={onCellSelect}
              selectedValue={selectedValue}
              selectedCells={selectedCells}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
