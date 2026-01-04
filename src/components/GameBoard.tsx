import React from 'react';
import { CellData } from '../utils/sudokuGenerator';
import Cell from './Cell';

type GameBoardProps = {
  board: CellData[][];
  onChange: (row: number, col: number, value: number | null) => void;
  onCellSelect: (row: number, col: number) => void;
  selectedValue: number | null;
  selectedCell: { row: number; col: number } | null;
};

const GameBoard: React.FC<GameBoardProps> = ({ board, onChange, onCellSelect, selectedValue, selectedCell }) => {
  return (
    <div className="gameboard-container" style={{position: 'relative'}}>
      <div className="gameboard sudoku-grid" style={{position: 'relative'}}>
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
              selectedCell={selectedCell}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
