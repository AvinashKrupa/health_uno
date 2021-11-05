import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const Radio = (props) => {
  return (
    <Form.Group>
      <br />
      <Row>
        <Form.Label>{props.label}</Form.Label>
      </Row>
      <Row className="g-2 radio-gap">
        {props.options && props.options.length && props.options.map((item) => {
          return (
            <Col md key={item.id}>
            <input
              className="form-check-input"
              type="radio"
              id={item.id}
              value={item.value}
              checked={item.checked}
              onChange={(e) => props.handleSelect(e.target.id)}
            ></input>
            <label  className="form-check-label" for={props.id}>
              {item.value}
            </label>
          </Col>
          )
        })}
      </Row>
    </Form.Group>
  );
};

export default Radio;
