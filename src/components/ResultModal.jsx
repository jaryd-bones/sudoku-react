import { Modal, Button } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

const ResultModal = ({ show, title, body, onClose, onNew, variant = "success" }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          {variant === "success" ? (
            <CheckCircleFill className="text-success fs-3"/>
          ): (
            <XCircleFill className="text-danger fs-3"/>
          )}
          <span>{title}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{body}</div>
        {onNew && (
          <div className="mt-3 text-center">
            <Button variant="primary" onClick={onNew}>
              New Puzzle
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ResultModal;
