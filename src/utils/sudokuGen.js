import { deepClone, generateFullBoard, solve } from "./sudokuCore";

const PREFILLED_TARGETS = {
  easy: 38,
  medium: 32,
  hard: 26,
};

const BOARD_SIZE = 9;
const LAST_IDX = BOARD_SIZE - 1;

const createSolvedAndPuzzle = () => {
  const solution = generateFullBoard();
  const puzzle = deepClone(solution);
  return { solution, puzzle };
};

// Used for randomized removal order
const buildShuffledIndices = () => {
  const indices = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

// Map difficutly to target number of prefilled cells
const computeTargetPrefilled = (difficulty) =>
  PREFILLED_TARGETS[difficulty] ?? PREFILLED_TARGETS.medium;

// Convert 0-80 to [row, col]
const indexToRowCol = (index) => [(index / BOARD_SIZE) | 0, index % BOARD_SIZE];

// Mirror of (row, col) for 180 degree rotational symmetry
const getMirrorCell = (row, col) => [LAST_IDX - row, LAST_IDX - col];

const hasUniqueSolution = (puzzle) => {
  const { solutions } = solve(puzzle, { countSolutions: true, limit: 2 });
  return solutions <= 1;
};

const tryRemove = (puzzle, row, col) => {
  if (puzzle[row][col] === 0) return false;

  const saved = puzzle[row][col];
  puzzle[row][col] = 0;

  // If cell doesnt say removed, revert and return false
  if (!hasUniqueSolution(puzzle)) {
    puzzle[row][col] = saved;
    return false;
  }
  return true;  // Return true if cell stays removed
};

const tryRemoveSymmetricPair = (puzzle, row, col) => {
  const [mr, mc] = getMirrorCell(row, col);

  // Center cell case, single remove
  if (row === mr && col === mc) {
    return tryRemove(puzzle, row, col) ? 1 : 0;
  }

  if (puzzle[row][col] === 0 && puzzle[mr][mc] === 0) return 0;

  const a = puzzle[row][col];
  const b = puzzle[mr][mc];

  // Remove both
  const hadA = a !== 0;
  const hadB = b !== 0;
  if (!hadA && !hadB) return 0;

  if (hadA) puzzle[row][col] = 0;
  if (hadB) puzzle[mr][mc] = 0;

  if (!hasUniqueSolution(puzzle)) {
    // Revert both
    if (hadA) puzzle[row][col] = a;
    if (hadB) puzzle[mr][mc] = b;
    return 0;
  }

  // Return number of cells removed
  return (hadA ? 1 : 0) + (hadB ? 1 : 0);
};

export const generatePuzzle = (difficulty = "medium") => {
  const { solution, puzzle } = createSolvedAndPuzzle();
  const indices = buildShuffledIndices();

  const targetPrefilled = computeTargetPrefilled(difficulty);
  let prefilledCount = BOARD_SIZE * BOARD_SIZE;
  const symmetric = true;

  for (const index of indices) {
    if (prefilledCount <= targetPrefilled) break;

    const [row, col] = indexToRowCol(index);
    if (puzzle[row][col] === 0) continue;

    if (symmetric) {
      const removed = tryRemoveSymmetricPair(puzzle, row, col);
      if (removed > 0) prefilledCount -= removed;
    } else {
      if (tryRemove(puzzle, row, col)) prefilledCount--;
    }
  }

  return { puzzle, solution };
};
