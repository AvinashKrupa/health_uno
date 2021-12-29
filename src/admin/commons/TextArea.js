import React from "react";
import { Form, Container } from "react-bootstrap";

const TextArea = (props) => {
  return (
    <Container className={props.noPadding? 'no-padding': ''}>
      <Form.Label style={props.labelStyle ? props.labelStyle : {}} className="textarea-label">{props.label}</Form.Label>
      <Form.Control
        className="textarea-field"
        as="textarea"
        id={props.id}
        placeholder={props.placeholder}
        value={props.value}
        rows={props.row}
        cols={props.cols}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.value}
      </Form.Control>
    </Container>
  );
};

export default TextArea;
