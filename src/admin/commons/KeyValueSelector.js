import React from "react";
import { Form } from "react-bootstrap";

const KeyValueSelector = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <div>
      <select style = {{width: "100%"}} className="form-control" id={props.id} value={props.value} onChange={(e) =>  props.handleSelect(e.target.value)}>
        <option value={`|${props.defaultValue}`} >{props.defaultValue}</option>
        {props.options.map((item) => (
          <option value={`${item.id}|${item.value}`}>{item.value}</option>
        ))}
      </select>
      </div>
    </Form.Group>
  );
};

export default KeyValueSelector;
