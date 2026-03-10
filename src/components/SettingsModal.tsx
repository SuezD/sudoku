import React from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  seed: string;
  newDifficulty: 'Easy' | 'Medium' | 'Hard';
  newSeed: string;
  onDifficultyChange: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  onSeedChange: (seed: string) => void;
  onRestartPuzzle: () => void;
  onNewPuzzle: () => void;
  onLoadSeed: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  difficulty,
  seed,
  newDifficulty,
  newSeed,
  onDifficultyChange,
  onSeedChange,
  onRestartPuzzle,
  onNewPuzzle,
  onLoadSeed,
}) => {
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Game Settings</h2>

        <div className="settings-section">
          <h3>Current Puzzle</h3>
          <p className="current-puzzle-info">
            {difficulty} #{seed}
          </p>
          <button className="settings-button-primary" onClick={onRestartPuzzle}>
            Restart Puzzle
          </button>
          <button className="settings-button-primary" onClick={onNewPuzzle}>
            New Puzzle
          </button>
        </div>

        <div className="settings-section">
          <h3>Difficulty</h3>
          <div className="difficulty-buttons">
            {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                className={`difficulty-button ${newDifficulty === diff ? 'active' : ''}`}
                onClick={() => onDifficultyChange(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h3>Load by Seed</h3>
          <div className="seed-input-group">
            <input
              type="text"
              value={newSeed}
              onChange={(e) => onSeedChange(e.target.value.toUpperCase())}
              placeholder="Enter 5-character seed"
              maxLength={5}
              className="seed-input"
            />
            <button
              className="settings-button-primary"
              onClick={onLoadSeed}
              disabled={!newSeed || !/^[a-zA-Z0-9]{5}$/.test(newSeed)}
            >
              Load
            </button>
          </div>
        </div>

        <button className="settings-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
