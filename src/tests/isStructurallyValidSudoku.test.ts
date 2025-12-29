import { isStructurallyValidSudoku } from '../utils/sudokuValidator';

describe('isStructurallyValidSudoku', () => {
	it('returns true for a valid 4x4 board', () => {
		const board = [
			[ { value: 1, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true } ],
			[ { value: 3, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true } ],
			[ { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true } ],
			[ { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true } ],
		];
		expect(isStructurallyValidSudoku(board)).toBe(true);
	});

	it('returns false for a board with duplicate in a row', () => {
		const board = [
			[ { value: 1, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true } ],
			[ { value: 3, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true } ],
			[ { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true } ],
			[ { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true } ],
		];
		expect(isStructurallyValidSudoku(board)).toBe(false);
	});

	it('returns false for a board with duplicate in a column', () => {
		const board = [
			[ { value: 1, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true } ],
			[ { value: 3, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true } ],
			[ { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true } ],
			[ { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true } ],
		];
		expect(isStructurallyValidSudoku(board)).toBe(false);
	});

	it('returns false for a board with duplicate in a box', () => {
		const board = [
			[ { value: 1, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true } ],
			[ { value: 3, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true } ],
			[ { value: 2, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true }, { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true } ],
			[ { value: 4, notes: [], isInitial: true }, { value: 3, notes: [], isInitial: true }, { value: 2, notes: [], isInitial: true }, { value: 1, notes: [], isInitial: true } ],
		];
		expect(isStructurallyValidSudoku(board)).toBe(false);
	});
});
