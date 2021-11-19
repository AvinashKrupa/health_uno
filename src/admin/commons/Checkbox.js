import React from 'react'
import { Form, InputGroup } from "react-bootstrap";

const Checkbox = (props) => {
  return (
    <Form.Group>
      <br />
      <InputGroup>
        <Form.Check type="checkbox" id={props.id} checked={props.checked} onChange={(e) => props.handleSelect(!props.checked)}></Form.Check>
        <span>{props.label}</span>
      </InputGroup>
    </Form.Group>
  );
};
export default Checkbox;
