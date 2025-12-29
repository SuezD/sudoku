import { Board } from '../../utils/sudokuGenerator';

export function isStructurallyValidSudoku(board: Board): boolean {
  const size = board.length;
  const base = Math.sqrt(size);
  const validSet = new Set(Array.from({ length: size }, (_, i) => i + 1));

  // Check rows
  for (const row of board) {
    const values = row.map(cell => cell.value).filter(v => v !== null);
    const set = new Set(values);
    if (set.size !== values.length) return false;
    for (const v of set) if (!validSet.has(v as number)) return false;
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    const values = board.map(row => row[c].value).filter(v => v !== null);
    const set = new Set(values);
    if (set.size !== values.length) return false;
    for (const v of set) if (!validSet.has(v as number)) return false;
  }

  // Check boxes
  for (let br = 0; br < base; br++) {
    for (let bc = 0; bc < base; bc++) {
      const values: number[] = [];
      for (let r = 0; r < base; r++) {
        for (let c = 0; c < base; c++) {
          const cell = board[br * base + r][bc * base + c].value;
          if (cell !== null) values.push(cell);
        }
      }
      const set = new Set(values);
      if (set.size !== values.length) return false;
      for (const v of set) if (!validSet.has(v as number)) return false;
    }
  }
  return true;
}
