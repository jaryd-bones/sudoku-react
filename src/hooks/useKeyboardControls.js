import { useEffect } from "react";

export default function useKeyboardControls({ enabled, onMove, onPlace }) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Movement
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const directionMap = {
          ArrowUp: "up",
          ArrowDown: "down",
          ArrowLeft: "left",
          ArrowRight: "right",
        };
        onMove?.(directionMap[e.key]);
        return;
      }
      // Place 1-9
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        onPlace?.(Number(e.key));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onMove, onPlace]);
}
