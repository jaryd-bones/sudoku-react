import { Spinner } from "react-bootstrap";

export default function LoadingPanel() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 240 }}>
      <Spinner animation="border" role="status" />
      <div className="text-muted mt-2">Generating puzzle…</div>
    </div>
  );
}
