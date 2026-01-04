import { generateBoard } from '../utils/sudokuGenerator';
import { isStructurallyValidSudoku } from '../utils/sudokuValidator';

describe('Sudoku Generator', () => {
  it('should generate a 9x9 board for Easy', () => {
    const board = generateBoard(3, 'Easy', 'testA');
    expect(board.length).toBe(9);
    expect(board.every(row => row.length === 9)).toBe(true);
  });

  it('should generate a 9x9 board for Medium', () => {
    const board = generateBoard(3, 'Medium', 'testB');
    expect(board.length).toBe(9);
    expect(board.every(row => row.length === 9)).toBe(true);
  });

  it('should generate a 9x9 board for Hard', () => {
    const board = generateBoard(3, 'Hard', 'testC');
    expect(board.length).toBe(9);
    expect(board.every(row => row.length === 9)).toBe(true);
  });

  it('should not mutate the original board when shuffling', () => {
    const board1 = generateBoard(3, 'Easy', 'seed1');
    const board2 = generateBoard(3, 'Easy', 'seed2');
    expect(board1).not.toBe(board2);
    expect(JSON.stringify(board1)).not.toBe(JSON.stringify(board2));
  });

  it('should only use numbers within the valid range', () => {
    const board = generateBoard(3, 'Medium', 'testE');
    const valid = board.flat().every(cell =>
      cell.value === null || (cell.value >= 1 && cell.value <= 9)
    );
    expect(valid).toBe(true);
  });

  it('should generate structurally valid boards repeatedly', () => {
    for (let i = 0; i < 20; i++) {
      const board = generateBoard(3, 'Hard', 'repeat' + i);
      expect(isStructurallyValidSudoku(board)).toBe(true);
    }
  });
});
