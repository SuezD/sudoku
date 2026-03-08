import React from 'react';

import './App.css';
import GameBoard from './components/GameBoard';
import NumberPad from './components/NumberPad';
import UndoRedo from './components/UndoRedo';
import confetti from 'canvas-confetti';

import { Board, CellData, generateBoard } from './utils/sudokuGenerator';
import { isStructurallyValidSudoku } from './utils/sudokuValidator';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const createSeed = useCallback(() => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let seed = '';
    for (let i = 0; i < 5; i++) {
      seed += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return seed;
  }, []);

  const parseHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    const parts = hash.split("/");
    if (parts.length === 2) {
      const [difficulty, seed] = parts;
      if ((difficulty === "easy" || difficulty === "medium" || difficulty === "hard") && /^[a-zA-Z0-9]{5}$/.test(seed)) {
        return { difficulty, seed };
      }
    }

    const defaultSeed = createSeed();
    return { difficulty: "hard", seed: defaultSeed };
  }, [createSeed]);

  const generateBoardWithDifficulty = useCallback((base: number, seed: string | null, difficulty: 'Easy' | 'Medium' | 'Hard' | null): { board: CellData[][], difficulty: 'Easy' | 'Medium' | 'Hard', seed: string } => {
    if (difficulty) {
      const actualSeed = seed || createSeed();
      return { board: generateBoard(base, difficulty, actualSeed), difficulty, seed: actualSeed };
    } else if (seed) {
      const rng = seedrandom(seed);
      const filledCells = Math.floor(rng() * (40 - 17 + 1)) + 17;
      const diff = filledCells <= 22 ? 'Hard' : filledCells <= 30 ? 'Medium' : 'Easy';
      return { board: generateBoard(base, filledCells, seed), difficulty: diff, seed };
    }
    const fallbackSeed = createSeed();
    return { board: generateBoard(base, 40, fallbackSeed), difficulty: 'Easy', seed: fallbackSeed };
  }, [createSeed]);

  function getInitialState() {
    const parsed = parseHash();
    const diff = parsed.difficulty.charAt(0).toUpperCase() + parsed.difficulty.slice(1).toLowerCase();
    const { board, difficulty, seed } = generateBoardWithDifficulty(BASE, parsed.seed, diff as 'Easy' | 'Medium' | 'Hard');
    return { seed, difficulty, board };
  }

  const [seed, setSeed] = useState<string | null>(() => getInitialState().seed);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(() => getInitialState().difficulty);
  const [board, setBoard] = useState<CellData[][] | null>(() => getInitialState().board);

  const [valid, setValid] = useState<boolean | null>(null);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [dragStartCell, setDragStartCell] = useState<{ row: number; col: number } | null>(null);

  const [highlightValue, setHighlightValue] = useState<number | null>(null);
  const undoStack = useRef<CellData[][][]>([]);
  const redoStack = useRef<CellData[][][]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
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

  useEffect(() => {
    function onHashChange() {
      const parsed = parseHash();
      window.location.hash = `/${parsed.difficulty}/${parsed.seed}`;
      const diff = parsed.difficulty.charAt(0).toUpperCase() + parsed.difficulty.slice(1).toLowerCase();
      const { board, difficulty, seed } = generateBoardWithDifficulty(BASE, parsed.seed, diff as 'Easy' | 'Medium' | 'Hard');
      setSeed(seed);
      setDifficulty(difficulty);
      setBoard(board);
      // clear undo/redo history when new puzzle loads
      undoStack.current.length = 0;
      redoStack.current.length = 0;
      updateStackCounts();
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [generateBoardWithDifficulty, parseHash]);

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

  const handleMultiNote = (num: number, cells: { row: number; col: number }[]) => {
    if (!board) return; // board may be null before initialization

    // Check if any selected cell is missing this note
    const anyMissing = cells.some(({ row, col }) => 
      !board[row][col].isInitial && board[row][col].value === null && !board[row][col].notes.includes(num)
    );
    setHighlightValue(anyMissing ? num : null);
    setBoard(prev => {
      const newBoard = deepCloneBoard(prev!);
      cells.forEach(({ row, col }) => {
        if (newBoard[row][col].isInitial || newBoard[row][col].value !== null) return;
        let notes = newBoard[row][col].notes;
        if (anyMissing) {
          // Add to cells that don't have it
          if (!notes.includes(num)) {
            notes.push(num);
            notes.sort();
          }
        } else {
          // All have it, so remove from all
          notes = notes.filter(n => n !== num);
        }
        newBoard[row][col].notes = notes;
      });
      // Push to undo stack
      if (undoStack.current.length === 0 || !boardsAreEqual(undoStack.current[undoStack.current.length - 1], prev!)) {
        undoStack.current.push(deepCloneBoard(prev!));
        redoStack.current.length = 0;
        updateStackCounts();
      }
      return newBoard;
    });
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    setBoard(prev => {
      const newBoard = deepCloneBoard(prev!);
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
        !boardsAreEqual(prev!, newBoard) &&
        (undoStack.current.length === 0 || !boardsAreEqual(undoStack.current[undoStack.current.length - 1], prev!))
      ) {
        undoStack.current.push(deepCloneBoard(prev!));
        redoStack.current.length = 0;
        updateStackCounts();
      }
      return newBoard;
    });
  };

  useEffect(() => {
    const isValid = isStructurallyValidSudoku(board!);
    setValid(isValid);
    if (isValid === false) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [board]);

  const updateStackCounts = () => {
    setUndoCount(undoStack.current.length);
    setRedoCount(redoStack.current.length);
  };

  const handleUndo = useCallback(() => {
    if (undoStack.current.length > 0) {
      redoStack.current.push(deepCloneBoard(board!));
      const prevBoard = undoStack.current.pop();
      if (prevBoard) setBoard(deepCloneBoard(prevBoard));
      updateStackCounts();
    }
  }, [board]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length > 0) {
      undoStack.current.push(deepCloneBoard(board!));
      const nextBoard = redoStack.current.pop();
      if (nextBoard) setBoard(deepCloneBoard(nextBoard));
      updateStackCounts();
    }
  }, [board]);

  const selectedValue = selectedCells.length > 0 && board ? board[selectedCells[0].row][selectedCells[0].col].value : null;
  // If a cell is selected and has a value, highlight that value
  const effectiveHighlight = selectedValue != null ? selectedValue : highlightValue;

  const handleArrowNavigation = useCallback((e: KeyboardEvent) => {
    const size = 9;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      setSelectedCells(prev => {
        let row = prev.length > 0 ? prev[0].row : 0;
        let col = prev.length > 0 ? prev[0].col : 0;
        if (e.key === "ArrowUp") row = (row + size - 1) % size;
        if (e.key === "ArrowDown") row = (row + 1) % size;
        if (e.key === "ArrowLeft") col = (col + size - 1) % size;
        if (e.key === "ArrowRight") col = (col + 1) % size;
        return [{ row, col }];
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
    // Deselect cell when clicking outside the grid
    function handleClickOutside(e: MouseEvent) {
      const grid = document.getElementById('sudoku-grid');
      if (grid && !grid.contains(e.target as Node)) {
        setSelectedCells([]);
        setHighlightValue(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    // Toggle pencil mode on custom event
    const handler = () => setPencilMode(p => !p);
    window.addEventListener('togglePencilMode', handler);

    return () => {
      window.removeEventListener('togglePencilMode', handler);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            {board && (
              <GameBoard
                board={board}
                onChange={handleCellChange}
                onCellSelect={(row, col) => {
                  setSelectedCells([{ row, col }]);
                  const v = board[row][col].value;
                  if (v != null) {
                    setHighlightValue(v);
                  } else {
                    setHighlightValue(null);
                  }
                }}                onCellDragStart={(row, col) => {
                  setDragStartCell({ row, col });
                  setSelectedCells([{ row, col }]);
                  const v = board[row][col].value;
                  if (v != null) {
                    setHighlightValue(v);
                  } else {
                    setHighlightValue(null);
                  }
                }}
                onCellDrag={(row, col) => {
                  if (dragStartCell) {
                    setSelectedCells(prev => {
                      const alreadySelected = prev.some(c => c.row === row && c.col === col);
                      if (!alreadySelected) {
                        return [...prev, { row, col }];
                      }
                      return prev;
                    });
                  }
                }}
                onCellDragEnd={() => {
                  setDragStartCell(null);
                }}                selectedValue={effectiveHighlight}
                selectedCells={selectedCells}
              />
            )}
          </div>
          <div className="game-stats">
            <div>{difficulty + " #" + seed}</div>
            <div style={{ color: 'red', fontWeight: 'bold' }}>{valid === false ? "INVALID INPUT" : ""}</div>
            <div>{timeElapsed}</div>
          </div>
          <div className="numberpad-container">
            {board && (
              <>
                <NumberPad
                  onChange={handleCellChange}
                  onMultiNote={handleMultiNote}
                  selectedCells={selectedCells}
                  board={board}
                  onPencilClick={() => setPencilMode(!pencilMode)}
                  pencilMode={pencilMode}
                />
                <UndoRedo
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  disabledUndo={undoCount === 0}
                  disabledRedo={redoCount === 0}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
