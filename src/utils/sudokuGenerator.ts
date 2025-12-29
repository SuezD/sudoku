export type CellData = {
  value: number | null;
  notes: number[];
  isInitial?: boolean;
};

export type Board = CellData[][];

const BASE = 3;

function createEmptyBoard(size: number): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ value: null, notes: [], isInitial: false }))
  );
}

export function generateBoard(filledCells?: number): Board {
  return generateBoardWithBase(BASE, filledCells);
}

export function generateBoardWithBase(base: number = 3, filledCells?: number): Board {
  const size = base * base;
  let board = generateBaseBoard(base);

  board = shuffleDigits(board, base);
  board = shuffleGroups(board, 'row', true, base); // Shuffle rows within bands
  board = shuffleGroups(board, 'col', true, base); // Shuffle columns within stacks
  board = shuffleGroups(board, 'row', false, base); // Shuffle row bands
  board = shuffleGroups(board, 'col', false, base); // Shuffle column stacks

  const cellsToRemove = (size * size) - (filledCells ?? (size * size - 1));
  board = removeCells(board, cellsToRemove, base);

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

function shuffleArray<T>(array: T[]): T[] {
  // use Fisher-Yates shuffle algorithm
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleDigits(board: Board, base: number): Board {
  const size = base * base;
  const shuffledDigits = shuffleArray(Array.from({ length: size }, (_, i) => i + 1));
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
  base: number
): Board {
  const size = base * base;
  const newBoard: Board = createEmptyBoard(size);

  if (withinBand) {
    for (let band = 0; band < base; band++) {
      const indices = shuffleArray(Array.from({ length: base }, (_, i) => i));
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
    const bands = shuffleArray(Array.from({ length: base }, (_, i) => i));
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

function removeCells(board: Board, cellsToRemove: number, base: number): Board {
  const size = base * base;
  let removed = 0;
  const newBoard: Board = board.map(row => row.map(cell => ({ ...cell })));
  while (removed < cellsToRemove) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (newBoard[r][c].value !== null) {
      newBoard[r][c].value = null;
      newBoard[r][c].isInitial = false;
      removed++;
    }
  }
  return newBoard;
}
