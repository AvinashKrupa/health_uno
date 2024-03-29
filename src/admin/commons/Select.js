import React, {Component} from "react";
import { Form } from "react-bootstrap";

const Selector = (props) => {
  return (
    <Form.Group>
      <br />
      {props.label ? <Form.Label>{props.label}{props.required && <span className="star">*</span>}</Form.Label> : null}
      <div>
      <select required={props.required || false} placeholder={props.placeholder} className="form-control" style = {{width: "100%"}} id={props.id} value={props.value} onChange={(e) => props.handleSelect(e.target.value)}>
        <option value="" >{props.defaultValue}</option>
        {props.options.map((item, key) => (
          <option key={key} value={item}>{item}</option>
        ))}
      </select>
      </div>
    </Form.Group>
  );
};
export default Selector;
