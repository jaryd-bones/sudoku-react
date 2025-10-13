const SudokuGrid = ({ puzzle, current, selected, onSelect, errorCell }) => {
  const isBoxRight = (col) => col === 2 || col === 5;
  const isBoxBottom = (row) => row === 2 || row === 5;

  const sameBox = (row, col, row2, col2) =>
    Math.floor(row / 3) === Math.floor(row2 / 3) &&
    Math.floor(col / 3) === Math.floor(col2 / 3);

  return (
    <div className="sudoku-board" role="grid" aria-label="Sudoku board" aria-rowcount={9} aria-colcount={9}>
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 9 }).map((__, col) => {
          const given = puzzle?.[row]?.[col] || 0;
          const value = (current?.[row]?.[col] || 0) || 0;

          const selectedHere = selected && selected.row === row && selected.col === col;
          const isErrorHere = errorCell && errorCell.row === row && errorCell.col === col;

          const isRelated =
            selected &&
            !selectedHere &&
            (selected.row === row || selected.col === col || sameBox(selected.row, selected.col, row, col));

          const classes = [
            "sudoku-cell",
            given ? "prefilled" : "",
            selectedHere ? "selected" : "",
            isRelated ? "related" : "",
            isErrorHere ? "error" : "",
            isBoxRight(col) ? "box-right" : "",
            isBoxBottom(row) ? "box-bottom" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={`${row}-${col}`}
              role="gridcell"
              aria-selected={selectedHere ? "true" : "false"}
              className={classes}
              onClick={() => {
                if (!given) onSelect?.(row, col);
              }}
            >
              {value !== 0 ? value : ""}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SudokuGrid;
