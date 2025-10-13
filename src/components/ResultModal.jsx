import { Modal, Button } from "react-bootstrap";

const ResultModal = ({ show, title, body, onClose, onNew, variant = "success" }) => {
  const iconClass =
    variant === "success" ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger";

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <i className={`bi ${iconClass} fs-3`} aria-hidden="true" />
          <span>{title}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        {onNew && (
          <Button variant="primary" onClick={onNew}>
            New Puzzle
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ResultModal;