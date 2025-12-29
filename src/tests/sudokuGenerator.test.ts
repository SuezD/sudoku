import { generateBoard, generateBoardWithBase } from '../utils/sudokuGenerator';
import { isStructurallyValidSudoku } from '../utils/sudokuValidator';

describe('Sudoku Generator', () => {
  it('should generate a 9x9 board by default', () => {
    const board = generateBoard(3, 40);
    expect(board.length).toBe(9);
    expect(board.every(row => row.length === 9)).toBe(true);
  });

  it('should generate a board with the correct number of filled cells', () => {
    const filledCells = 40;
    const board = generateBoard(3, filledCells);
    const filledCount = board.flat().filter(cell => cell.value !== null).length;
    expect(filledCount).toBe(filledCells);
  });

  it('should generate a 4x4 board with base 2', () => {
    const board = generateBoardWithBase(2, 16);
    expect(board.length).toBe(4);
    expect(board.every(row => row.length === 4)).toBe(true);
  });

  it('should not mutate the original board when shuffling', () => {
    const board1 = generateBoard(3, 40);
    const board2 = generateBoard(3, 40);
    expect(board1).not.toBe(board2);
    expect(JSON.stringify(board1)).not.toBe(JSON.stringify(board2));
  });

  it('should only use numbers within the valid range', () => {
    const board = generateBoard(3, 40);
    const valid = board.flat().every(cell =>
      cell.value === null || (cell.value >= 1 && cell.value <= 9)
    );
    expect(valid).toBe(true);
  });

  it('should generate structurally valid boards repeatedly', () => {
    for (let i = 0; i < 20; i++) {
      const board = generateBoard(3, 40);
      expect(isStructurallyValidSudoku(board)).toBe(true);
    }
  });
});
