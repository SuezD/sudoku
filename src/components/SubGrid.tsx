import React from 'react';
import Cell from './Cell';
import { CellData } from '../utils/sudoku-generator';

type SubgridProps = {
  values: CellData[][];
  initialValues: CellData[][];
  startRow: number;
  startCol: number;
  pencilMode?: boolean;
  onChange?: (row: number, col: number, value: number | null) => void;
};

const Subgrid: React.FC<SubgridProps> = ({ values, initialValues, startRow, startCol, pencilMode, onChange }) => (
  <table
    style={{
      borderCollapse: 'collapse',
      borderSpacing: 0,
      border: '2px solid #333',
      background: '#f9f9f9',
    }}
  >
    <tbody>
      {values.map((rowVals, rIdx) => (
        <tr key={rIdx}>
          {rowVals.map((val, cIdx) => (
            <td key={cIdx} style={{ padding: 0, border: '1px solid #ccc' }}>
              <Cell
                key={`${rIdx}-${cIdx}`}
                value={val}
                row={startRow + rIdx}
                col={startCol + cIdx}
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

export default Subgrid;
