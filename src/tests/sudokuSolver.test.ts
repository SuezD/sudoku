import { hasOneValidSolution } from "../utils/sudokuSolver";
import { Board } from "../utils/sudokuGenerator";

describe("hasOneValidSolution", () => {
	it("should return true for a board with a unique solution (naked singles only)", () => {
		// Given a 4x4 board (base=2) with only naked singles left
		// 1 2 | 3 _
		// 3 4 | _ _
		// ----+----
		// _ _ | 4 3
		// _ 3 | 2 1
		const base = 2;
		const board: Board = [
			[ { value: 1, notes: [] }, { value: 2, notes: [] }, { value: 3, notes: [] }, { value: null, notes: [] } ],
			[ { value: 3, notes: [] }, { value: 4, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
			[ { value: null, notes: [] }, { value: null, notes: [] }, { value: 4, notes: [] }, { value: 3, notes: [] } ],
			[ { value: null, notes: [] }, { value: 3, notes: [] }, { value: 2, notes: [] }, { value: 1, notes: [] } ],
		];
		const result = hasOneValidSolution(board, base);
		expect(result).toBe(true);
		expect(board[0][3].value).toBe(null);
	});

	it("should return true for a solved board", () => {
		const base = 2;
		const board: Board = [
			[ { value: 1, notes: [] }, { value: 2, notes: [] }, { value: 3, notes: [] }, { value: 4, notes: [] } ],
			[ { value: 3, notes: [] }, { value: 4, notes: [] }, { value: 1, notes: [] }, { value: 2, notes: [] } ],
			[ { value: 2, notes: [] }, { value: 1, notes: [] }, { value: 4, notes: [] }, { value: 3, notes: [] } ],
			[ { value: 4, notes: [] }, { value: 3, notes: [] }, { value: 2, notes: [] }, { value: 1, notes: [] } ],
		];
		const result = hasOneValidSolution(board, base);
		expect(result).toBe(true);
	});

	it("should return false for a structurally invalid board", () => {
		const base = 2;
		const board: Board = [
			[ { value: 1, notes: [] }, { value: 1, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
			[ { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
			[ { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
			[ { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
		];
		const result = hasOneValidSolution(board, base);
		expect(result).toBe(false);
	});

  it("should return false for a board with more than one solution", () => {
		const base = 2;
		const board: Board = [
			[ { value: 1, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
			[ { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
			[ { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
			[ { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] }, { value: null, notes: [] } ],
		];
		const result = hasOneValidSolution(board, base);
		expect(result).toBe(false);
	});
});
