import { Form, Button } from "react-bootstrap";

const DifficultyPicker = ({ difficulty, onChange, onGenerate, generating }) => {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate?.();
      }}
    >
      <fieldset className="mb-4">
        <legend className="fs-6 mb-2"> Difficulty</legend>

        <Form.Check
          type="radio"
          id="diff-easy"
          name="difficulty"
          label="Easy"
          value="easy"
          checked={difficulty === "easy"}
          onChange={() => onChange("easy")}
          className="mb-1"
        />

        <Form.Check
          type="radio"
          id="diff-medium"
          name="difficulty"
          label="Medium"
          value="medium"
          checked={difficulty === "medium"}
          onChange={() => onChange("medium")}
          className="mb-1"
        />

        <Form.Check
          type="radio"
          id="diff-hard"
          name="difficulty"
          label="Hard"
          value="hard"
          checked={difficulty === "hard"}
          onChange={() => onChange("hard")}
        />
      </fieldset>

      <div className="d-grid">
        <Button type="submit" variant="primary" disabled={generating} aria-busy={generating}>
          {generating ? "Generating…" : "Play"}
        </Button>
      </div>
    </Form>
  );
}

export default DifficultyPicker;