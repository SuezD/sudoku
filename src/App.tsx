import './App.css';
import GameBoard from './components/GameBoard';
import NumberPad from './components/NumberPad';
import confetti from 'canvas-confetti';

import { Board, CellData, generateBoard } from './utils/sudokuGenerator';
import { isStructurallyValidSudoku } from './utils/sudokuValidator';
import { useState } from 'react';

function cloneBoard(board: CellData[][]): CellData[][] {
  return board.map(row => row.slice());
}

function isBoardFilled(board: Board): boolean {
  return board.every(row => row.every(cell => cell.value !== null));
}

function App() {
  const filledCells = 40;
  const [initialBoard] = useState<CellData[][]>(() => generateBoard(filledCells));
  const [board, setBoard] = useState<CellData[][]>(() => cloneBoard(initialBoard));
  const [valid, setValid] = useState<boolean | null>(null);
  const [pencilMode, setPencilMode] = useState<boolean>(false);

  const handleNumberClick = (num: number) => {
    console.log('Number clicked:', num);
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    if (initialBoard[row][col].isInitial) return;
    setBoard(prev => {
      const newBoard = prev.map(r => r.map(cell => ({ ...cell, notes: [...cell.notes] })));
      if (pencilMode) {
        newBoard[row][col].value = null;
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
        newBoard[row][col].notes = [];
        newBoard[row][col].value = value;
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

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Sudoku</h1>
      <GameBoard board={board} onChange={handleCellChange} pencilMode={pencilMode} />
      <div style={{ marginTop: 24 }}>
        <NumberPad onNumberClick={handleNumberClick} onPencilClick={() => setPencilMode(!pencilMode)} pencilMode={pencilMode} />
      </div>
      <div style={{ minHeight: 24, marginTop: 12, color: valid ? 'green' : 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {valid != null && !valid ? 'Solution is not valid!' : ''}
      </div>
    </div>
  );
}

export default App;
