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

function App() {
  // fill between 17 and 40 cells
  const filledCells = Math.floor(Math.random() * (40 - 17 + 1)) + 17;
  const [initialBoard] = useState<CellData[][]>(() => generateBoard(BASE, filledCells));
  const [board, setBoard] = useState<CellData[][]>(() => cloneBoard(initialBoard));
  const [valid, setValid] = useState<boolean | null>(null);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleNumberClick = (num: number) => {
    console.log('Number clicked:', num);
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    if (initialBoard[row][col].isInitial) return;
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
