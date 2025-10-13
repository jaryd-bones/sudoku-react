import { useEffect, useRef, useState } from "react";

const useTimer = () => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalIdRef = useRef(null);

  const start = () => {
    if (intervalIdRef.current) return;
    const startEpochMs = Date.now() - elapsedMs;
    intervalIdRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startEpochMs);
    }, 1000);
  };

  const stop = () => {
    if (!intervalIdRef.current) return;
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  };

  const reset = () => {
    stop();
    setElapsedMs(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, []);

  const formatTime = () => {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return { elapsedMs, start, stop, reset, formatTime };
};

export default useTimer;
