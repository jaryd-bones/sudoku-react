export const boardsEqual = (a, b) =>
  a.length === b.length &&
  a.every(
    (rowArr, rowIndex) =>
      rowArr.length === b[rowIndex].length &&
      rowArr.every((val, colIndex) => val === b[rowIndex][colIndex])
  );

export const isPrefilled = (puzzle, row, col) => puzzle[row][col] !== 0;

export const nextEditableCell = (puzzle, startRow, startCol, direction) => {
  const stepMap = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
  const step = stepMap[direction];
  if (!step) return null;

  let row = startRow;
  let col = startCol;

  for (let k = 0; k < 81; k++) {
    row = (row + step[0] + 9) % 9;
    col = (col + step[1] + 9) % 9;
    if (puzzle[row][col] === 0) return { row, col };
  }
  return null;
};
