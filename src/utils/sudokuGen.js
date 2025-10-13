import { deepClone, generateFullBoard, solve } from "./sudokuCore";

const PREFILLED_TARGETS = {
  easy: 38,
  medium: 32,
  hard: 26,
};

export const generatePuzzle = (difficulty = "medium") => {
  // Full solved board
  const solution = generateFullBoard();
  const puzzle = deepClone(solution);

  // Build shuffled list of all indices 0-80
  const indices = Array.from({ length: 81 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const targetPrefilled = PREFILLED_TARGETS[difficulty] ?? PREFILLED_TARGETS.medium;
  let prefilledCount = 81;

  const symmetric = true;

  const tryRemove = (row, col) => {
    if (puzzle[row][col] === 0) return false;
    const savedValue = puzzle[row][col];
    puzzle[row][col] = 0;

    // Check if unique solution, bail if not unique
    const { solutions } = solve(puzzle, { countSolutions: true, limit: 2 });
    if (solutions > 1) {
      puzzle[row][col] = savedValue;  // Revert, not unique
      return false;
    }
    return true;
  };

  for (const index of indices) {
    if (prefilledCount <= targetPrefilled) break;

    const row = (index / 9) | 0;
    const col = index % 9;

    if (puzzle[row][col] === 0) continue;

    if (symmetric) {
      const rowMirror = 8 - row;
      const colMirror = 8 - col;

      // Remove pair (row, ccol) and (rowMirror, colMirror) together when possible
      const savedAValue = puzzle[row][col];
      const savedBValue = puzzle[rowMirror][colMirror];

      // If same cell, fall back to single remove
      if (row === rowMirror && col === colMirror) {
        if (tryRemove(row, col)) prefilledCount--;
        continue;
      }

      // Remove pair
      puzzle[row][col] = 0;
      puzzle[rowMirror][colMirror] = 0;

      const { solutions } = solve(puzzle, { countSolutions: true, limit: 2 });
      if (solutions > 1) {
        // Revert pair
        puzzle[row][col] = savedAValue;
        puzzle[rowMirror][colMirror] = savedBValue;
      } else {
        prefilledCount -= 2;
      }
    } else {
      if (tryRemove(row, col)) prefilledCount--;
    }
  }

  return { puzzle, solution };
};
