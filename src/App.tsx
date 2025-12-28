import './App.css';
import GameBoard from './components/GameBoard';
import NumberPad from './components/NumberPad';
import confetti from 'canvas-confetti';

import { generateSimpleBoard } from './utils/sudoku-generator';
import { isValidSudoku } from './utils/sudoku-validator';
import { useState } from 'react';

function cloneBoard(board: (number | null)[][]): (number | null)[][] {
  return board.map(row => row.slice());
}

function isBoardFilled(board: (number | null)[][]): boolean {
  return board.every(row => row.every(cell => cell !== null));
}

function App() {
  const [initialBoard] = useState<(number | null)[][]>(() => generateSimpleBoard());
  const [board, setBoard] = useState<(number | null)[][]>(() => cloneBoard(initialBoard));
  const [valid, setValid] = useState<boolean | null>(null);

  const handleNumberClick = (num: number) => {
    console.log('Number clicked:', num);
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    if (initialBoard[row][col] !== null) return;
    setBoard(prev => {
      const newBoard = prev.map(arr => arr.slice());
      newBoard[row][col] = value;
      const isValid = isValidSudoku(newBoard);
      setValid(isValid);
      if (isBoardFilled(newBoard) && isValid) {
        confetti();
      }
      return newBoard;
    });
    
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Sudoku</h1>
      <GameBoard board={board} onChange={handleCellChange} initialBoard={initialBoard} />
      <div style={{ marginTop: 24 }}>
        <NumberPad onNumberClick={handleNumberClick} />
      </div>
      <div style={{ minHeight: 24, marginTop: 12, color: valid ? 'green' : 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {valid != null && !valid ? 'Solution is not valid!' : ''}
      </div>
    </div>
  );
}

export default App;
