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
    <div className="gameboard-container">
      <div className="gameboard sudoku-grid">
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
