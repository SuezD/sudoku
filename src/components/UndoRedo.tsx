import React from 'react';

type UndoRedoProps = {
  onUndo: () => void;
  onRedo: () => void;
  disabledUndo?: boolean;
  disabledRedo?: boolean;
};

const UndoRedo: React.FC<UndoRedoProps> = ({ onUndo, onRedo, disabledUndo = false, disabledRedo = false }) => {
  return (
    <div className="undo-redo-root">
      <button
        onMouseDown={e => e.preventDefault()}
        onClick={onUndo}
        disabled={disabledUndo}
        aria-label="Undo"
        title="Undo (Ctrl+Z)"
        className="undo-redo-button"
      >
        ↺
      </button>
      <button
        onMouseDown={e => e.preventDefault()}
        onClick={onRedo}
        disabled={disabledRedo}
        aria-label="Redo"
        title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
        className="undo-redo-button"
      >
        ↻
      </button>
    </div>
  );
};

export default UndoRedo;
