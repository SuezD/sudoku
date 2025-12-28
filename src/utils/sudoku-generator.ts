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

// Returns a 9x9 board with a few random cells filled (NOT VALID)
export function generateSimpleBoard(filledCells: number = 80): CellData[][] {
	const board = createEmptyBoard();
	let count = 0;
	while (count < filledCells) {
		const row = Math.floor(Math.random() * 9);
		const col = Math.floor(Math.random() * 9);
		if (board[row][col].value === null) {
			board[row][col].value = Math.floor(Math.random() * 9) + 1;
      board[row][col].isInitial = true;
			count++;
		}
	}
	return board;
}
