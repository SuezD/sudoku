import { hasOneValidSolution } from "./sudokuSolver";
import seedrandom from "seedrandom";

export type CellData = {
  value: number | null;
  notes: number[];
  isInitial?: boolean;
};

export type Board = CellData[][];

function createEmptyBoard(size: number): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ value: null, notes: [], isInitial: false }))
  );
}

export function generateBoard(base: number, filledCells: number, seed?: string): Board {
  return generateBoardWithBase(base, filledCells, seed);
}

export function generateBoardWithBase(base: number = 3, filledCells: number, seed?: string): Board {
  const size = base * base;
  const rng = seedrandom(seed || "default");
  let board = generateBaseBoard(base);

  board = shuffleDigits(board, base, rng);
  board = shuffleGroups(board, 'row', true, base, rng);
  board = shuffleGroups(board, 'col', true, base, rng);
  board = shuffleGroups(board, 'row', false, base, rng);
  board = shuffleGroups(board, 'col', false, base, rng);

  const cellsToRemove = (size * size) - filledCells;
  board = removeCells(board, cellsToRemove, base, rng);

  return board;
}

function generateBaseBoard(base: number): Board {
  const size = base * base;
  const board: Board = createEmptyBoard(size);
  const pattern = (r: number, c: number) => (base * (r % base) + Math.floor(r / base) + c) % size;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      board[r][c].value = pattern(r, c) + 1;
      board[r][c].isInitial = true;
    }
  }
  return board;
}

function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleDigits(board: Board, base: number, rng: () => number): Board {
  const size = base * base;
  const shuffledDigits = shuffleArray(Array.from({ length: size }, (_, i) => i + 1), rng);
  return board.map(row =>
    row.map(cell =>
      cell.value !== null
        ? { ...cell, value: shuffledDigits[cell.value - 1] }
        : { ...cell }
    )
  );
}

function shuffleGroups(
  board: Board,
  groupType: 'row' | 'col',
  withinBand: boolean,
  base: number,
  rng: () => number
): Board {
  const size = base * base;
  const newBoard: Board = createEmptyBoard(size);

  if (withinBand) {
    for (let band = 0; band < base; band++) {
      const indices = shuffleArray(Array.from({ length: base }, (_, i) => i), rng);
      for (let i = 0; i < base; i++) {
        if (groupType === 'row') {
          const sourceRow = band * base + indices[i];
          const targetRow = band * base + i;
          newBoard[targetRow] = board[sourceRow].map(cell => ({ ...cell }));
        } else {
          const sourceCol = band * base + indices[i];
          const targetCol = band * base + i;
          for (let r = 0; r < size; r++) {
            newBoard[r][targetCol] = { ...board[r][sourceCol] };
          }
        }
      }
    }
  } else {
    const bands = shuffleArray(Array.from({ length: base }, (_, i) => i), rng);
    for (let bandIndex = 0; bandIndex < base; bandIndex++) {
      const band = bands[bandIndex];
      for (let i = 0; i < base; i++) {
        if (groupType === 'row') {
          const sourceRow = band * base + i;
          const targetRow = bandIndex * base + i;
          newBoard[targetRow] = board[sourceRow].map(cell => ({ ...cell }));
        } else {
          const sourceCol = band * base + i;
          const targetCol = bandIndex * base + i;
          for (let r = 0; r < size; r++) {
            newBoard[r][targetCol] = { ...board[r][sourceCol] };
          }
        }
      }
    }
  }
  return newBoard;
}

function removeCells(board: Board, cellsToRemove: number, base: number, rng: () => number): Board {
  const size = base * base;
  let removed = 0;
  const newBoard: Board = board.map(row => row.map(cell => ({ ...cell })));

  const positions: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      positions.push({ r, c });
    }
  }
  const shuffledPositions = shuffleArray(positions, rng);

  for (let i = 0; i < shuffledPositions.length && removed < cellsToRemove; i++) {
    const { r, c } = shuffledPositions[i];
    if (newBoard[r][c].value !== null) {
      const oldValue = newBoard[r][c].value;
      const oldIsInitial = newBoard[r][c].isInitial;
      newBoard[r][c].value = null;
      newBoard[r][c].isInitial = false;
      if (hasOneValidSolution(newBoard, base)) {
        removed++;
      } else {
        newBoard[r][c].value = oldValue;
        newBoard[r][c].isInitial = oldIsInitial;
      }
    }
  }

  if (removed < cellsToRemove) {
    const actualFilledCells = size * size - removed;
    const requestedFilledCells = size * size - cellsToRemove;
    console.warn(`Generated board with ${actualFilledCells} filled cells (requested ${requestedFilledCells}).`);
  }

  return newBoard;
}
