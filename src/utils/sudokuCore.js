export const deepClone = (board) => board.map((row) => row.slice());

export const shuffle = (array) => {
  // Fisher Yates shuffle (in place)
  for (let end = array.length - 1; end > 0; end--) {
    const swapIndex = Math.floor(Math.random() * (end + 1));
    [array[end], array[swapIndex]] = [array[swapIndex], array[end]];
  }
  return array;
};

export const isValid = (board, row, col, value) => {
  // Row and Col
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value || board[i][col] === value) return false;
  }
  // Box
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      if (board[boxRowStart + boxRow][boxColStart + boxCol] === value) return false;
    }
  }
  return true;
};

export const findEmpty = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!board[row][col]) return [row, col];  // 0 means empty
    }
  }
  return null;
};

export const solve = (input, { countSolutions = false, limit = 2 } = {}) => {
  const board = deepClone(input);
  let solutions = 0;

  const search = () => {
    const emptySpot = findEmpty(board);
    if (!emptySpot) {
      solutions++;
      return true;
    }
    const [row, col] = emptySpot;
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const value of numbers) {
      if (isValid(board, row, col, value)) {
        board[row][col] = value;
        const solvedNow = search();
        if (!countSolutions && solvedNow) return true;  // Stop at first solution
        if (countSolutions && solutions >= limit) return true;  // Early exit
        board[row][col] = 0;
      }
    }
    return false;
  };

  const ok = search();
  return { solved: ok || solutions > 0, grid: board, solutions };
};

// Generate fully solved board with backtracking algorithm
export const generateFullBoard = () => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  const fill = () => {
    const emptySpot = findEmpty(board);
    if (!emptySpot) return true;
    const [row, col] = emptySpot;
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const value of numbers) {
      if (isValid(board, row, col, value)) {
        board[row][col] = value;
        if (fill()) return true;
        board[row][col] = 0;
      }
    }
    return false;
  }

  fill();
  return board;
};
