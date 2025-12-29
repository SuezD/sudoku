import { Board } from "./sudokuGenerator";

function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell, notes: [...cell.notes] })));
}

function computeCandidates(board: Board, base: number): number[][][] {
  const size = base * base;
  const candidates: number[][][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => [])
  );
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].value !== null) continue;
      const used = new Set<number>();
      // Row
      for (let k = 0; k < size; k++) {
        if (board[row][k].value !== null) used.add(board[row][k].value!);
      }
      // Col
      for (let k = 0; k < size; k++) {
        if (board[k][col].value !== null) used.add(board[k][col].value!);
      }
      // Box
      const boxRow = Math.floor(row / base) * base;
      const boxCol = Math.floor(col / base) * base;
      for (let r = 0; r < base; r++) {
        for (let c = 0; c < base; c++) {
          const cell = board[boxRow + r][boxCol + c];
          if (cell.value !== null) used.add(cell.value);
        }
      }
      candidates[row][col] = [];
      for (let n = 1; n <= size; n++) {
        if (!used.has(n)) candidates[row][col].push(n);
      }
    }
  }
  return candidates;
}

function findCellWithFewestCandidates(board: Board, base: number): { row: number, col: number, candidates: number[] } | null {
  const size = base * base;
  let minLen = Infinity;
  let minRow = -1, minCol = -1, minCandidates: number[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = board[row][col];
      if (cell.value === null && cell.notes.length > 0 && cell.notes.length < minLen) {
        minLen = cell.notes.length;
        minRow = row;
        minCol = col;
        minCandidates = cell.notes;
      }
    }
  }
  if (minRow === -1) return null;
  return { row: minRow, col: minCol, candidates: minCandidates };
}

function fillNakedSingles(board: Board, base: number): boolean {
  const size = base * base;
  let changed = false;
  let candidates = computeCandidates(board, base);
  let progress = true;
  while (progress) {
    progress = false;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = board[row][col];
        if (cell.value === null && candidates[row][col].length === 1) {
          cell.value = candidates[row][col][0];
          cell.notes = [];
          progress = true;
          changed = true;
        } else if (cell.value === null) {
          cell.notes = candidates[row][col].slice();
        }
      }
    }
    if (progress) {
      candidates = computeCandidates(board, base);
    }
  }
  return changed;
}


function isSolved(board: Board, base: number): boolean {
  const size = base * base;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].value === null) return false;
    }
  }
  return true;
}

function solutionCount(board: Board, base: number, maxSolutions = 2): number {
  const workingBoard = cloneBoard(board);
  fillNakedSingles(workingBoard, base);
  const size = base * base;

  // Check for unsolvable state
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (workingBoard[row][col].value === null && workingBoard[row][col].notes.length === 0) {
        return 0;
      }
    }
  }

  if (isSolved(workingBoard, base)) return 1;

  const cellInfo = findCellWithFewestCandidates(workingBoard, base);
  if (!cellInfo) return 0;

  let solutions = 0;
  for (const candidate of cellInfo.candidates) {
    const nextBoard = cloneBoard(workingBoard);
    nextBoard[cellInfo.row][cellInfo.col].value = candidate;
    nextBoard[cellInfo.row][cellInfo.col].notes = [];
    solutions += solutionCount(nextBoard, base, maxSolutions - solutions);
    if (solutions >= maxSolutions) return solutions;
  }
  return solutions;
}

export function hasOneValidSolution(board: Board, base: number): boolean {
  return solutionCount(board, base, 2) === 1;
}
