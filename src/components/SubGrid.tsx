import React from 'react';
import Cell from './Cell';
import { CellData } from '../utils/sudoku-generator';

type SubgridProps = {
  data: CellData[][];
  sgRow: number;
  sgCol: number;
  pencilMode: boolean;
  onChange: (row: number, col: number, value: number | null) => void;
};

function Subgrid({ data, sgRow, sgCol, pencilMode, onChange }: SubgridProps) {
  return (
    <table
      style={{
        borderCollapse: 'collapse',
        borderSpacing: 0,
        border: '2px solid #333',
        background: '#f9f9f9',
      }}
    >
      <tbody>
        {data.map((rowVals, rIdx) => (
          <tr key={rIdx}>
            {rowVals.map((val, cIdx) => (
              <td key={cIdx} style={{ padding: 0, border: '1px solid #ccc', verticalAlign: 'middle' }}>
                <Cell
                  key={`${sgRow + rIdx}-${sgCol + cIdx}`}
                  value={val}
                  row={sgRow + rIdx}
                  col={sgCol + cIdx}
                  onChange={onChange}
                  pencilMode={pencilMode}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Subgrid;
