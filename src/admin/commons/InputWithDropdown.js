import React, { useState } from "react";
import { Form, Dropdown, DropdownButton, InputGroup } from "react-bootstrap";

const InputWithDropdown = (props) => {
  const [dropdownTitle, setDropdownTitle] = useState("Relation Type");
  
  const dropOptions = props.options.map((item, index) => {
    return (
      <Dropdown.Item key={index} value={props.selectedValue} onClick={() => dropdownClick(item)}>{item}</Dropdown.Item>
    );
  });

  const dropdownClick = (item) => {
    setDropdownTitle(item);
    props.optionChange(item);
  };

  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <InputGroup>
        <DropdownButton
          variant="outline-secondary"
          title={props.selectedValue ? props.selectedValue : dropdownTitle}
          align="end"
        >
          {dropOptions}
        </DropdownButton>
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
          onBlur={(e) => (props.onBlur ? props.onBlur(e.target.value) : null)}
        ></Form.Control>
      </InputGroup>
    </Form.Group>
  );
};
export default InputWithDropdown;
