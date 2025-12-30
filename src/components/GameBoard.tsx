import React from 'react';
import SubGrid from './SubGrid';
import { CellData } from '../utils/sudokuGenerator';

type GameBoardProps = {
  board: CellData[][];
  onChange: (row: number, col: number, value: number | null) => void;
  onCellSelect: (row: number, col: number) => void;
  selectedValue: number | null;
  selectedCell: { row: number; col: number } | null;
};

const GameBoard: React.FC<GameBoardProps> = ({ board, onChange, onCellSelect, selectedValue, selectedCell }) => {
  const subgrids = [];
  for (let sgRow = 0; sgRow < 3; sgRow++) {
    for (let sgCol = 0; sgCol < 3; sgCol++) {
      const values = board.slice(sgRow * 3, sgRow * 3 + 3).map(row => row.slice(sgCol * 3, sgCol * 3 + 3));
      subgrids.push(
        <SubGrid
          key={`${sgRow}-${sgCol}`}
          data={values}
          sgRow={sgRow * 3}
          sgCol={sgCol * 3}
          onChange={onChange}
          onCellSelect={onCellSelect}
          selectedValue={selectedValue}
          selectedCell={selectedCell}
        />
      );
    }
  }

  return (
    <div className="gameboard-container">
      <div className="gameboard" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', width: '100%', height: '100%' }}>
        {subgrids}
      </div>
    </div>
  );
};

export default GameBoard;
