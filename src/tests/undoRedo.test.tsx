import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Make sure the board is deterministic for tests
beforeEach(() => {
  window.location.hash = '#/easy/AAAAA';
});

describe('Undo/Redo buttons', () => {
  it('renders undo and redo controls and they behave correctly', async () => {
    render(<App />);

    // wait for number pad to appear
    const numberOne = await screen.findByLabelText('Number 1');
    expect(numberOne).not.toBeNull();

    // find first editable cell
    const cells = await screen.findAllByRole('textbox');
    let editableCell: HTMLInputElement | undefined;
    for (const cell of cells as HTMLInputElement[]) {
      if (!cell.readOnly) {
        editableCell = cell;
        break;
      }
    }
    expect(editableCell).toBeDefined();

    // select and enter a number
    fireEvent.click(editableCell!);
    fireEvent.click(numberOne);
    expect(editableCell!.value).toBe('1');

    const undoBtn = screen.getByLabelText('Undo');
    const redoBtn = screen.getByLabelText('Redo');
    expect((undoBtn as HTMLButtonElement).disabled).toBe(false);
    expect((redoBtn as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(undoBtn);
    expect(editableCell!.value).toBe('');
    expect((redoBtn as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(redoBtn);
    expect(editableCell!.value).toBe('1');
  });
});
