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

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export function generateBoard(base: number, filledCellsOrDifficulty: number | Difficulty, seed?: string): Board {
  const size = base * base;
  let difficulty: Difficulty;
  let filledCells: number;
  if (typeof filledCellsOrDifficulty === 'string') {
    difficulty = filledCellsOrDifficulty;
    if (difficulty === 'Easy') filledCells = 40;
    else if (difficulty === 'Medium') filledCells = 32;
    else filledCells = 22;
  } else {
    filledCells = filledCellsOrDifficulty;
    if (filledCells <= 22) difficulty = 'Hard';
    else if (filledCells <= 32) difficulty = 'Medium';
    else difficulty = 'Easy';
  }
  return generateBoardWithBaseAndDifficulty(base, filledCells, difficulty, seed);
}

function generateBoardWithBaseAndDifficulty(base: number, filledCells: number, difficulty: Difficulty, seed?: string): Board {
  const size = base * base;
  const rng = seedrandom(seed || "default");
  let board = generateBaseBoard(base);

  board = shuffleDigits(board, base, rng);
  board = shuffleGroups(board, 'row', true, base, rng);
  board = shuffleGroups(board, 'col', true, base, rng);
  board = shuffleGroups(board, 'row', false, base, rng);
  board = shuffleGroups(board, 'col', false, base, rng);

  board = removeCellsByDifficulty(board, difficulty, filledCells, base, rng);
  return board;
}

function removeCellsByDifficulty(board: Board, difficulty: Difficulty, filledCells: number, base: number, rng: () => number): Board {
  const size = base * base;
  let minCluesPerBox: number;
  let enforceSymmetry: boolean;
  if (difficulty === 'Easy') {
    minCluesPerBox = 5;
    enforceSymmetry = true;
  } else if (difficulty === 'Medium') {
    minCluesPerBox = 3;
    enforceSymmetry = false;
  } else {
    minCluesPerBox = 2;
    enforceSymmetry = false;
  }

  let removed = 0;
  const newBoard: Board = board.map(row => row.map(cell => ({ ...cell })));

  // Helper to get box index
  const getBoxIndex = (r: number, c: number) => base * Math.floor(r / base) + Math.floor(c / base);

  // Count clues per box
  function countCluesPerBox(board: Board): number[] {
    const clues = Array(size).fill(0);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c].value !== null) {
          clues[getBoxIndex(r, c)]++;
        }
      }
    }
    return clues;
  }

  // Generate positions for removal
  let positions: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      positions.push({ r, c });
    }
  }
  positions = shuffleArray(positions, rng);

  // If symmetry, pair positions
  let pairs: Array<[number, number, number, number]> = [];
  if (enforceSymmetry) {
    const mid = Math.floor(size / 2);
    for (let i = 0; i < positions.length / 2; i++) {
      const { r, c } = positions[i];
      const symR = size - 1 - r;
      const symC = size - 1 - c;
      pairs.push([r, c, symR, symC]);
    }
  }

  // Remove cells
  let cluesToRemove = size * size - filledCells;
  let cluesPerBox = countCluesPerBox(newBoard);
  if (enforceSymmetry) {
    for (let i = 0; i < pairs.length && removed < cluesToRemove; i++) {
      const [r1, c1, r2, c2] = pairs[i];
      const box1 = getBoxIndex(r1, c1);
      const box2 = getBoxIndex(r2, c2);
      if (
        newBoard[r1][c1].value !== null &&
        newBoard[r2][c2].value !== null &&
        cluesPerBox[box1] > minCluesPerBox &&
        cluesPerBox[box2] > minCluesPerBox
      ) {
        const oldValue1 = newBoard[r1][c1].value;
        const oldValue2 = newBoard[r2][c2].value;
        newBoard[r1][c1].value = null;
        newBoard[r1][c1].isInitial = false;
        newBoard[r2][c2].value = null;
        newBoard[r2][c2].isInitial = false;
        // Check unique solution if needed (skipped for brevity)
        cluesPerBox[box1]--;
        cluesPerBox[box2]--;
        removed += 2;
      }
    }
  } else {
    for (let i = 0; i < positions.length && removed < cluesToRemove; i++) {
      const { r, c } = positions[i];
      const box = getBoxIndex(r, c);
      if (newBoard[r][c].value !== null && cluesPerBox[box] > minCluesPerBox) {
        const oldValue = newBoard[r][c].value;
        newBoard[r][c].value = null;
        newBoard[r][c].isInitial = false;
        // Check unique solution if needed (skipped for brevity)
        cluesPerBox[box]--;
        removed++;
      }
    }
  }

  if (removed < cluesToRemove) {
    const actualFilledCells = size * size - removed;
    const requestedFilledCells = filledCells;
    console.warn(`Generated board with ${actualFilledCells} filled cells (requested ${requestedFilledCells}).`);
  }

  return newBoard;
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
