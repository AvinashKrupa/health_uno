import React from "react";
import { Form } from "react-bootstrap";

const Input = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <Form.Control
        value={props.value}
        type={props.type}
        id={props.id}
        placeholder={props.placeholder || null}
        readOnly={props.readonly || false}
        disabled={props.disabled || false}
        onChange={(e) => props.onChange(e.target.value)}
        min={props.min}
        maxLength={props.maxLength}
        onBlur={(e) => props.onBlur? props.onBlur(e.target.value) : null}
      ></Form.Control>
    </Form.Group>
  );
};

export default Input;
