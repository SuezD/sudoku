import { Board } from "./sudokuGenerator";

export function isStructurallyValidSudoku(board: Board): boolean {
	const hasDuplicates = (arr: (number | null)[]) => {
		const nums = arr.filter((n): n is number => n !== null);
		return new Set(nums).size !== nums.length;
	};

	// use board length to determine size (9x9)
	const base = Math.sqrt(board.length);
	for (let i = 0; i < base * base; i++) {
		const row = board[i].map(cell => cell.value);
		const col = board.map(r => r[i].value);
		if (hasDuplicates(row) || hasDuplicates(col)) return false;
	}
  
	for (let boxRow = 0; boxRow < base; boxRow++) {
		for (let boxCol = 0; boxCol < base; boxCol++) {
			const cells: (number | null)[] = [];
			for (let r = 0; r < base; r++) {
				for (let c = 0; c < base; c++) {
					cells.push(board[boxRow * base + r][boxCol * base + c].value);
				}
			}
			if (hasDuplicates(cells)) return false;
		}
	}

	return true;
}
