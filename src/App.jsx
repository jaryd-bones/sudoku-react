import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import DifficultyPicker from "./components/DifficultyPicker.jsx";
import HudBar from "./components/HudBar.jsx";
import SudokuGrid from "./components/SudokuGrid.jsx";
import NumberPad from "./components/NumberPad.jsx";
import ResultModal from "./components/ResultModal.jsx";
import LoadingPanel from "./components/LoadingPanel.jsx";
import useTimer from "./hooks/useTimer.js";
import useSudokuGame from "./hooks/useSudokuGame.js";
import useKeyboardControls from "./hooks/useKeyboardControls.js";
import usePause from "./hooks/usePause.js";
import { generatePuzzle } from "./utils/sudokuGen.js";
import "./styles/dark-theme.css";
import { PauseFill, PlayFill } from "react-bootstrap-icons";

const App = () => {
  const [phase, setPhase] = useState("idle");  // idle | loading | playing
  const [difficulty, setDifficulty] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLossModal] = useState(false);

  const timer = useTimer();
  const {
    puzzle,
    solution,
    current,
    started,
    mistakes,
    selected,
    gameOver,
    errorCell,
    begin,
    resetToDifficulty,
    selectCell,
    placeNumber,
    moveSelection,
    MAX_MISTAKES,
  } = useSudokuGame({ timer });

  // Pause controls
  const { paused, setPaused, togglePause } = usePause({
    timer,
    started,
    gameOver,
  });

  // Generate and start
  const handleGenerate = async () => {
    setGenerating(true);
    setPhase("loading");
    try {
      await Promise.resolve();  // Let UI paint
      const { puzzle: generatedPuzzle, solution: solvedGrid } = await generatePuzzle(difficulty);
      begin(generatedPuzzle, solvedGrid);
      setShowWinModal(false);
      setShowLossModal(false);
      setPaused(false);
      setPhase("playing");
    } finally {
      setGenerating(false);
    }
  };

  const handleBackToDifficulty = () => {
    setPhase("idle");
    setPaused(false);
    setShowWinModal(false);
    setShowLossModal(false);
    resetToDifficulty();
  };

  // Keyboard controls, not active when game over or paused
  useKeyboardControls({
    enabled: started && !gameOver && !paused,
    onMove: moveSelection,
    onPlace: placeNumber,
  });

  const containerClass =
    phase === "idle" || phase === "loading"
      ? "min-vh-100 d-flex align-items-center justify-content-center py-4"
      : "py-4";

  const isWin =
    gameOver && current && solution && JSON.stringify(current) === JSON.stringify(solution);
  const isLoss =
    gameOver && !!puzzle && !!solution && JSON.stringify(current) !== JSON.stringify(solution);

  // Open the appropriate modal when the game ends
  useEffect(() => {
    if (!gameOver) return;
    const didWin =
      current && solution && JSON.stringify(current) === JSON.stringify(solution);
    setShowWinModal(didWin);
    setShowLossModal(!didWin);
  }, [gameOver, current, solution]);

  return (
    <Container className={containerClass}>
      <Row className="justify-content-center w-100 mx-0">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 mb-0">Sudoku</h1>

                {phase !== "idle" && (
                  <div className="d-flex gap-2">
                    {phase === "playing" && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={togglePause}
                        aria-label={paused ? "Resume" : "Pause"}
                        title={paused ? "Resume" : "Pause"}
                        className="d-flex justify-content-center align-items-center"
                      >
                        {paused ? <PlayFill aria-hidden /> : <PauseFill aria-hidden />}
                        <span className="visually-hidden">{paused ? "Resume" : "Pause"}</span>
                      </Button>
                    )}

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleBackToDifficulty}
                      aria-label="Back to difficulty selection"
                    >
                      New Puzzle
                    </Button>
                  </div>
                )}
              </div>

              {phase === "idle" && (
                <>
                  <p className="text-muted"> Choose a difficulty and press play to generate a random puzzle. </p>
                  <DifficultyPicker
                    difficulty={difficulty}
                    onChange={setDifficulty}
                    onGenerate={handleGenerate}
                    generating={generating}
                  />
                </>
              )}

              {phase === "loading" && <LoadingPanel />}

              {phase === "playing" && (
                <>
                  <div className="mb-3">
                    <HudBar timeText={timer.formatTime()} mistakes={mistakes} maxMistakes={MAX_MISTAKES} />
                  </div>

                  <div className="position-relative w-100 d-flex flex-column align-items-center">
                    <div
                      style={{
                        filter: paused ? "blur(3px)" : "none",
                        pointerEvents: paused ? "none" : "auto",
                        transition: "filter 120ms ease",
                      }}
                    >
                      <SudokuGrid
                        puzzle={puzzle}
                        current={current}
                        selected={selected}
                        onSelect={selectCell}
                        errorCell={errorCell}
                      />
                      <NumberPad
                        onNumber={placeNumber}
                        disabled={!started || !selected || gameOver || paused}
                      />
                    </div>

                    {/* Pause overlay */}
                    {paused && (
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{
                          background: "rgba(0,0,0,0.35)",
                          backdropFilter: "blur(2px)",
                          zIndex: 2,
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label="Resume"
                        title="Resume"
                        onClick={togglePause}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            togglePause();
                          }
                        }}
                      >
                        <div className="text-center">
                          <PauseFill size={48} aria-hidden="true" />
                          <div className="mt-2 text-muted">Paused</div>
                        </div>
                      </div>
                    )}

                  </div>

                  <Alert variant="light" className="mt-3 mb-0">
                    Make <strong>{MAX_MISTAKES} mistakes</strong> and you fail. Fill the entire grid correctly to win.
                  </Alert>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <ResultModal
        show={showWinModal}
        title="Puzzle Solved"
        body={`Nice work! Time: ${timer.formatTime()}`}
        onClose={() => setShowWinModal(false)}
        onNew={handleBackToDifficulty}
        variant="success"
      />
      <ResultModal
        show={showLoseModal}
        title="Three Mistakes"
        body="You'll get it next time. Try generating a new puzzle."
        onClose={() => setShowLossModal(false)}
        onNew={handleBackToDifficulty}
        variant="danger"
      />
    </Container>
  );
};

export default App;
