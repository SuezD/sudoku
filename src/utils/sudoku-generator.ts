function createEmptyBoard(): (number | null)[][] {
	return Array.from({ length: 9 }, () => Array(9).fill(null));
}

// Returns a 9x9 board with a few random cells filled (NOT VALID)
export function generateSimpleBoard(filledCells: number = 80): (number | null)[][] {
	const board = createEmptyBoard();
	let count = 0;
	while (count < filledCells) {
		const row = Math.floor(Math.random() * 9);
		const col = Math.floor(Math.random() * 9);
		if (board[row][col] === null) {
			board[row][col] = Math.floor(Math.random() * 9) + 1;
			count++;
		}
	}
	return board;
}
