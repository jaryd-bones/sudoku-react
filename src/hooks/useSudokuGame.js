import { useCallback, useState } from "react";
import { deepClone } from "../utils/sudokuCore";
import { boardsEqual, isPrefilled, nextEditableCell } from "../utils/gameUtils";

const MAX_MISTAKES = 3;

export default function useSudokuGame({ timer }) {
  // Puzzle state
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [current, setCurrent] = useState(null);

  // Gameplay state
  const [started, setStarted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [selected, setSelected] = useState(null);  // { row, col } | null
  const [gameOver, setGameOver] = useState(false);
  const [errorCell, setErrorCell] = useState(null); // { row, col } | null

  const begin = useCallback((generatedPuzzle, solvedGrid) => {
    setPuzzle(generatedPuzzle);
    setCurrent(deepClone(generatedPuzzle));
    setSolution(solvedGrid);
    setMistakes(0);
    setSelected(null);
    setGameOver(false);
    setStarted(true);
    timer.reset();
    timer.start();
  }, [timer]);

  const resetToDifficulty = useCallback(() => {
    setPuzzle(null);
    setCurrent(null);
    setSolution(null);
    setSelected(null);
    setMistakes(0);
    setGameOver(false);
    setStarted(false);
    setErrorCell(null);
    timer.reset();
  }, [timer]);

  const selectCell = useCallback((row, col) => {
    if (gameOver || !puzzle) return;
    if (isPrefilled(puzzle, row, col)) return;
    setSelected({ row, col });
  }, [gameOver, puzzle]);

  const placeNumber = useCallback((value) => {
    if (!selected || !current || !puzzle || !solution || gameOver) return;
    const { row, col } = selected;
    if (isPrefilled(puzzle, row, col)) return;

    if (value !== solution[row][col]) {
      setErrorCell({ row, col });
      setTimeout(() => setErrorCell(null), 450);
      setMistakes((prev) => {
        const next = prev + 1;
        if (next >= MAX_MISTAKES) {
          setGameOver(true);
          timer.stop();
        }
        return next;
      });
      return;
    }

    const nextGrid = deepClone(current);
    nextGrid[row][col] = value;
    setCurrent(nextGrid);

    if (boardsEqual(nextGrid, solution)) {
      setGameOver(true);
      timer.stop();
    }
  }, [selected, current, puzzle, solution, gameOver, timer]);

  const moveSelection = useCallback((direction) => {
    if (!puzzle) return;
    if (!selected) {
      // Pick first empty
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (!isPrefilled(puzzle, row, col)) {
            setSelected({ row, col });
            return;
          }
        }
      }
      return;
    }
    const next = nextEditableCell(puzzle, selected.row, selected.col, direction);
    if (next) setSelected(next);
  }, [puzzle, selected]);

  return {
    // State
    puzzle, solution, current,
    started, mistakes, selected, gameOver, errorCell,
    // Actions
    begin, resetToDifficulty, selectCell, placeNumber, moveSelection,
    // Constants
    MAX_MISTAKES,
  };
}
