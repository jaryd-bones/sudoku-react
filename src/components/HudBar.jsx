import { Badge } from "react-bootstrap";

const HudBar = ({ timeText = "0:00", mistakes = 0, maxMistakes = 3 }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="fw-semibold">
        Time: <span className="text-muted">{timeText}</span>
      </div>
      <div className="fw-semibold">
        Mistakes:{" "}
        <Badge bg={mistakes >= maxMistakes ? "danger" : "secondary"}>
          {mistakes}/{maxMistakes}
        </Badge>
      </div>
    </div>
  );
}

export default HudBar;