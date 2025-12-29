import './App.css';
import GameBoard from './components/GameBoard';
import NumberPad from './components/NumberPad';
import confetti from 'canvas-confetti';

import { Board, CellData, generateBoard } from './utils/sudokuGenerator';
import { isStructurallyValidSudoku } from './utils/sudokuValidator';
import { useState, useEffect, useCallback } from 'react';

const BASE = 3;

function cloneBoard(board: CellData[][]): CellData[][] {
  return board.map(row => row.slice());
}

function isBoardFilled(board: Board): boolean {
  return board.every(row => row.every(cell => cell.value !== null));
}

function removeValueFromNotes(board: CellData[][], row: number, col: number, value: number) {
  const size = 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  // Row
  for (let c = 0; c < size; c++) {
    if (c !== col) {
      board[row][c].notes = board[row][c].notes.filter(n => n !== value);
    }
  }
  // Col
  for (let r = 0; r < size; r++) {
    if (r !== row) {
      board[r][col].notes = board[r][col].notes.filter(n => n !== value);
    }
  }
  // Box
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row || c !== col) {
        board[r][c].notes = board[r][c].notes.filter(n => n !== value);
      }
    }
  }
}

function App() {
  // fill between 17 and 40 cells
  const filledCells = Math.floor(Math.random() * (40 - 17 + 1)) + 17;
  const [board, setBoard] = useState<CellData[][]>(() => generateBoard(BASE, filledCells));
  const [valid, setValid] = useState<boolean | null>(null);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellChange = (row: number, col: number, value: number | null) => {
    setBoard(prev => {
      const newBoard = prev.map(r => r.map(cell => ({ ...cell, notes: [...cell.notes] })));
      if (pencilMode) {
        newBoard[row][col].value = null;
        setValid(isStructurallyValidSudoku(newBoard));
        let notes = newBoard[row][col].notes;
        if (value === null) {
          newBoard[row][col].notes = [];
        } else {
          if (notes.includes(value)) {
            notes = notes.filter(n => n !== value);
          } else {
            notes.push(value);
            notes.sort();
          }
          newBoard[row][col].notes = notes;
        }
      } else {
        if (newBoard[row][col].value === value) {
          newBoard[row][col].value = null;
        } else {
          newBoard[row][col].value = value;
          if (value !== null) {
            removeValueFromNotes(newBoard, row, col, value);
          }
        }
        newBoard[row][col].notes = [];
        const isValid = isStructurallyValidSudoku(newBoard);
        setValid(isValid);
        if (isBoardFilled(newBoard) && isValid) {
          // make all cell readOnly
          // newBoard.forEach(row => row.forEach(cell => cell.isInitial = true));
          confetti();
        }
      }
      return newBoard;
    });
  };

  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : null;

  const handleArrowNavigation = useCallback((e: KeyboardEvent) => {
    const size = 9;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      setSelectedCell(prev => {
        let row = prev?.row ?? 0;
        let col = prev?.col ?? 0;
        if (e.key === "ArrowUp") row = (row + size - 1) % size;
        if (e.key === "ArrowDown") row = (row + 1) % size;
        if (e.key === "ArrowLeft") col = (col + size - 1) % size;
        if (e.key === "ArrowRight") col = (col + 1) % size;
        return { row, col };
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleArrowNavigation);
    return () => window.removeEventListener('keydown', handleArrowNavigation);
  }, [handleArrowNavigation]);

  useEffect(() => {
    const handler = () => setPencilMode(p => !p);
    window.addEventListener('togglePencilMode', handler);
    return () => window.removeEventListener('togglePencilMode', handler);
  }, []);
  
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Sudoku</h1>
      <GameBoard
        board={board}
        onChange={handleCellChange}
        onCellSelect={(row, col) => setSelectedCell({ row, col })}
        selectedValue={selectedValue}
        selectedCell={selectedCell}
      />
      <div style={{ marginTop: 24, width: '100%', maxWidth: 600 }}>
        <NumberPad
          onChange={handleCellChange}
          selectedCell={selectedCell}
          board={board}
          onPencilClick={() => setPencilMode(!pencilMode)}
          pencilMode={pencilMode}
        />
      </div>
      <div style={{ minHeight: 24, marginTop: 12, color: valid ? 'green' : 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {valid != null && !valid ? 'Solution is not valid!' : ''}
      </div>
    </div>
  );
}

export default App;
