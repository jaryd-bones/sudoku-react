import { useCallback, useEffect, useState } from "react";

const usePause = ({ timer, started, gameOver }) => {
  const [paused, setPaused] = useState(false);

  const pause = useCallback(() => {
    setPaused(true);
    timer.stop();
  }, [timer]);

  const resume = useCallback(() => {
    setPaused(false);
    if (started && !gameOver) timer.start();
  }, [timer, started, gameOver]);

  const togglePause = useCallback(() => {
    if (paused) resume();
    else pause();
  }, [paused, pause, resume]);

  // Enter paused state on blur
  useEffect(() => {
    const onBlur = () => {
      if (started && !gameOver) pause();
    };
    const onFocus = () => {
      if (started && !gameOver && !paused) timer.start();
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [started, gameOver, paused, timer, pause]);

  return { paused, setPaused, pause, resume, togglePause };
}

export default usePause;