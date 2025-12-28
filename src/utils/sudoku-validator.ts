export function isValidSudoku(board: (number | null)[][]): boolean {
	const hasDuplicates = (arr: (number | null)[]) => {
		const nums = arr.filter((n): n is number => n !== null);
		return new Set(nums).size !== nums.length;
	};

	for (let i = 0; i < 9; i++) {
		const row = board[i];
		const col = board.map(r => r[i]);
		if (hasDuplicates(row) || hasDuplicates(col)) return false;
	}
  
	for (let boxRow = 0; boxRow < 3; boxRow++) {
		for (let boxCol = 0; boxCol < 3; boxCol++) {
			const cells: (number | null)[] = [];
			for (let r = 0; r < 3; r++) {
				for (let c = 0; c < 3; c++) {
					cells.push(board[boxRow * 3 + r][boxCol * 3 + c]);
				}
			}
			if (hasDuplicates(cells)) return false;
		}
	}

	return true;
}
