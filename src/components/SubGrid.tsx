import React from 'react';
import Cell from './Cell';
import { CellData } from '../utils/sudokuGenerator';

type SubgridProps = {
  data: CellData[][];
  sgRow: number;
  sgCol: number;
  onChange: (row: number, col: number, value: number | null) => void;
  onCellSelect: (row: number, col: number) => void;
  selectedValue: number | null;
  selectedCell: { row: number; col: number } | null;
};

function Subgrid({ data, sgRow, sgCol, onChange, onCellSelect, selectedValue, selectedCell }: SubgridProps) {
  return (
    <table
      style={{
        borderCollapse: 'collapse',
        borderSpacing: 0,
        border: '2px solid #333',
        background: '#f9f9f9',
        width: '100%',
        height: '100%',
        tableLayout: 'fixed',
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
                  onSelect={onCellSelect}
                  selectedValue={selectedValue}
                  selectedCell={selectedCell}
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
