import React, {Component} from "react";
import { Form } from "react-bootstrap";

const Selector = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <select className="form-select" id={props.id} value={props.value} onChange={(e) => props.handleSelect(e.target.value)}>
        <option defaultValue={props.defaultValue}>{props.defaultValue}</option>
        {props.options.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select>
    </Form.Group>
  );
};
export default Selector;
