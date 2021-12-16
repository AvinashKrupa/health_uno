import React, {Component} from "react";
import { Form } from "react-bootstrap";

const Selector = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <div>
      <select className="form-control" style = {{width: "100%"}} id={props.id} value={props.value} onChange={(e) => props.handleSelect(e.target.value)}>
        <option defaultValue={props.defaultValue}>{props.defaultValue}</option>
        {props.options.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select>
      </div>
    </Form.Group>
  );
};
export default Selector;
