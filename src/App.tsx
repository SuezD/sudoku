import React from 'react';

import './App.css';
import GameBoard from './components/GameBoard';
import NumberPad from './components/NumberPad';
import confetti from 'canvas-confetti';

import { Board, CellData, generateBoard } from './utils/sudokuGenerator';
import { isStructurallyValidSudoku } from './utils/sudokuValidator';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import seedrandom from 'seedrandom';

const BASE = 3;

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
  function createOrGetSeedFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (hash && /^[a-zA-Z0-9]{5}$/.test(hash)) return hash;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let seed = '';
    for (let i = 0; i < 5; i++) {
      seed += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    window.location.hash = `#/${seed}`;
    return seed;
  }

  const [seed] = useState(createOrGetSeedFromHash);
  // fill between 17 and 40 cells
  const rng = seedrandom(seed);
  const filledCells = Math.floor(rng() * (40 - 17 + 1)) + 17;
  const difficulty = useMemo(() => filledCells <= 22 ? 'Hard' : filledCells <= 30 ? 'Medium' : 'Easy', [filledCells]);


  const [board, setBoard] = useState<CellData[][]>(() => generateBoard(BASE, filledCells, seed));
  const [valid, setValid] = useState<boolean | null>(null);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  // Clear highlight if selectedCell changes to an empty cell
  useEffect(() => {
    if (selectedCell) {
      const v = board[selectedCell.row][selectedCell.col].value;
      if (v != null) {
        setHighlightValue(v);
      } else {
        setHighlightValue(null);
      }
    } else {
      setHighlightValue(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell]);
  // Track the last highlighted value (from cell select or note input)
  const [highlightValue, setHighlightValue] = useState<number | null>(null);
  const undoStack = useRef<CellData[][][]>([]);
  const redoStack = useRef<CellData[][][]>([]);
  const [shake, setShake] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState<string>('00:00');

  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setTimeElapsed(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const deepCloneBoard = (b: CellData[][]) => b.map(row => row.map(cell => ({ ...cell, notes: [...cell.notes] })));

  const boardsAreEqual = (a: CellData[][], b: CellData[][]) => {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].length; j++) {
        if (a[i][j].value !== b[i][j].value) return false;
        if (a[i][j].notes.length !== b[i][j].notes.length) return false;
        for (let k = 0; k < a[i][j].notes.length; k++) {
          if (a[i][j].notes[k] !== b[i][j].notes[k]) return false;
        }
      }
    }
    return true;
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    if (pencilMode && value != null) {
      setHighlightValue(value);
    } else if (!pencilMode && value != null) {
      setHighlightValue(value);
    }
    setBoard(prev => {
      const newBoard = deepCloneBoard(prev);
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
        if (isBoardFilled(newBoard) && isValid) {
          confetti({ origin: { x: 0.5, y: 0.8 } });
        }
      }
      // Only push if prev is not already the last entry
      if (
        !boardsAreEqual(prev, newBoard) &&
        (undoStack.current.length === 0 || !boardsAreEqual(undoStack.current[undoStack.current.length - 1], prev))
      ) {
        undoStack.current.push(deepCloneBoard(prev));
        redoStack.current.length = 0;
      }
      return newBoard;
    });
  };

  useEffect(() => {
    const isValid = isStructurallyValidSudoku(board);
    setValid(isValid);
    if (isValid === false) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [board]);

  const handleUndo = useCallback(() => {
    if (undoStack.current.length > 0) {
      redoStack.current.push(deepCloneBoard(board));
      const prevBoard = undoStack.current.pop();
      if (prevBoard) setBoard(deepCloneBoard(prevBoard));
    }
  }, [board]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length > 0) {
      undoStack.current.push(deepCloneBoard(board));
      const nextBoard = redoStack.current.pop();
      if (nextBoard) setBoard(deepCloneBoard(nextBoard));
    }
  }, [board]);

  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : null;
  // If a cell is selected and has a value, highlight that value
  const effectiveHighlight = selectedValue != null ? selectedValue : highlightValue;

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
    // Undo/Redo keybindings
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleArrowNavigation);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleArrowNavigation, handleUndo, handleRedo]);

  useEffect(() => {
    const handler = () => setPencilMode(p => !p);
    window.addEventListener('togglePencilMode', handler);
    return () => window.removeEventListener('togglePencilMode', handler);
  }, []);

  // Deselect cell when clicking outside the grid
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const grid = document.getElementById('sudoku-grid');
      if (grid && !grid.contains(e.target as Node)) {
        setSelectedCell(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        <h1 style={{ textAlign: 'center' }}>Sudoku</h1>
        <div id="sudoku-grid">
          <div
            className={shake ? 'sudoku-grid-outline shake' : 'sudoku-grid-outline'}
            style={valid === false ? { outline: '3px solid red', borderRadius: 8, transition: 'outline 0.2s' } : { outline: 'none', borderRadius: 8, transition: 'outline 0.2s' }}
          >
            <GameBoard
              board={board}
              onChange={handleCellChange}
              onCellSelect={(row, col) => {
                setSelectedCell({ row, col });
                const v = board[row][col].value;
                if (v != null) {
                  setHighlightValue(v);
                } else {
                  setHighlightValue(null);
                }
              }}
              selectedValue={effectiveHighlight}
              selectedCell={selectedCell}
            />
          </div>
          <div className="game-stats">
            <div>{difficulty + " #" + seed}</div>
            <div style={{ color: 'red', fontWeight: 'bold' }}>{valid === false ? "INVALID INPUT" : ""}</div>
            <div>{timeElapsed}</div>
          </div>
          <div className="numberpad-container">
            <NumberPad
              onChange={handleCellChange}
              selectedCell={selectedCell}
              board={board}
              onPencilClick={() => setPencilMode(!pencilMode)}
              pencilMode={pencilMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
