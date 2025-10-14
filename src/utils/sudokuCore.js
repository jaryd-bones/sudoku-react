export const deepClone = (board) => board.map((row) => row.slice());

export const shuffle = (array) => {
  for (let end = array.length - 1; end > 0; end--) {
    const swapIndex = Math.floor(Math.random() * (end + 1));
    [array[end], array[swapIndex]] = [array[swapIndex], array[end]];
  }
  return array;
};

const isValidPlacement = (board, row, col, value) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) return false;
  }
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRowStart + r][boxColStart + c] === value) return false;
    }
  }
  return true;
};

export const findNextEmptyCell = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!board[row][col]) return [row, col];  // 0 is empty
    }
  }
  return null;
};

export const searchSolutions = (
  board,
  { countSolutions = false, limit = 2 } = {},
  state = { solutions: 0 }
) => {
  const emptySpot = findNextEmptyCell(board);
  // If complete solution was found
  if (!emptySpot) {
    state.solutions++;
    return true;
  }

  const [row, col] = emptySpot;
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const value of numbers) {
    if (isValidPlacement(board, row, col, value)) {
      board[row][col] = value;
      const solvedNow = searchSolutions(board, { countSolutions, limit }, state);
      if (!countSolutions && solvedNow) return true;  // Stop early if only need first solution
      if (countSolutions && state.solutions >= limit) return true;  // Stop once counted enough
      board[row][col] = 0;  // Backtrack
    }
  }

  return false;  // No solution from this path
};

export const solve = (input, opts = {}) => {
  const board = deepClone(input);
  const state = { solutions: 0 };
  const ok = searchSolutions(board, opts, state);
  return { solved: ok || state.solutions > 0, grid: board, solutions: state.solutions };
};

const fillBoard = (board) => {
  const emptySpot = findNextEmptyCell(board);
  if (!emptySpot) return true;

  const [row, col] = emptySpot;
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const value of numbers) {
    if (isValidPlacement(board, row, col, value)) {
      board[row][col] = value;
      if (fillBoard(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
};

// Generate fully solved board with backtracking algorithm
export const generateFullBoard = () => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(board);
  return board;
};
