import React from 'react';
import SubGrid from './SubGrid';

import { CellData } from '../utils/sudoku-generator';

type GameBoardProps = {
  board: CellData[][];
  initialBoard: CellData[][];
  pencilMode: boolean;
  onChange: (row: number, col: number, value: number | null) => void;
};

const GameBoard: React.FC<GameBoardProps> = ({ board, initialBoard, pencilMode, onChange }) => {
  const subgrids = [];
  for (let sgRow = 0; sgRow < 3; sgRow++) {
    for (let sgCol = 0; sgCol < 3; sgCol++) {
      const values = board.slice(sgRow * 3, sgRow * 3 + 3).map(row => row.slice(sgCol * 3, sgCol * 3 + 3));
      const initialValues = initialBoard.slice(sgRow * 3, sgRow * 3 + 3).map(row => row.slice(sgCol * 3, sgCol * 3 + 3));
      subgrids.push(
        <SubGrid
          key={`${sgRow}-${sgCol}`}
          values={values}
          initialValues={initialValues}
          startRow={sgRow * 3}
          startCol={sgCol * 3}
          onChange={onChange}
          pencilMode={pencilMode}
        />
      );
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)' }}>
        {subgrids}
      </div>
    </div>
  );
};

export default GameBoard;
