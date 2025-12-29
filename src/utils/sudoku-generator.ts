export type CellData = {
  value: number | null;
  notes: number[];
  isInitial?: boolean;
};

function createEmptyBoard(): CellData[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, notes: [], isInitial: false }))
  );
}

export function generateBoard(filledCells: number = 80): CellData[][] {
  let board = generateBaseBoard();

  shuffleDigits(board);
  board = shuffleGroups(board, 'row', true); // shuffle rows within bands
  board = shuffleGroups(board, 'col', true); // shuffle cols within stacks
  board = shuffleGroups(board, 'row', false); // shuffle row bands
  board = shuffleGroups(board, 'col', false); // shuffle col stacks

  const cellsToRemove = 81 - filledCells;
  removeCells(board, cellsToRemove);

  return board;
}

function generateBaseBoard(): CellData[][] {
	const base = 3;
	const side = base * base;
	const board: CellData[][] = createEmptyBoard();

	const pattern = (r: number, c: number) => (base * (r % base) + Math.floor(r / base) + c) % side;
	for (let r = 0; r < side; r++) {
		for (let c = 0; c < side; c++) {
			board[r][c].value = pattern(r, c) + 1;
			board[r][c].isInitial = true;
		}
	}
	return board;
}

function shuffleArray<T>(array: T[]): T[] {
	// use Fisher-Yates shuffle algorithm
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function shuffleDigits(board: CellData[][]): CellData[][] {
	const shuffledDigits = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			if (board[r][c].value !== null) {
				board[r][c].value = shuffledDigits[board[r][c].value! - 1];
			}
		}
	}

	return board;
}

function shuffleGroups(
  board: CellData[][],
  groupType: 'row' | 'col',
  withinBand: boolean
): CellData[][] {
  const base = 3;
  const size = base * base;
  const newBoard: CellData[][] = createEmptyBoard();

  if (withinBand) {
    // Shuffle rows within each band or columns within each stack
    for (let band = 0; band < base; band++) {
      const indices = shuffleArray([0, 1, 2]);
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
    // Shuffle bands or stacks as a whole
    const bands = shuffleArray([0, 1, 2]);
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

function removeCells(board: CellData[][], cellsToRemove: number): void {
	let removed = 0;
	while (removed < cellsToRemove) {
		const r = Math.floor(Math.random() * 9);
		const c = Math.floor(Math.random() * 9);
		if (board[r][c].value !== null) {
			board[r][c].value = null;
			board[r][c].isInitial = false;
			removed++;
		}
	}
}
