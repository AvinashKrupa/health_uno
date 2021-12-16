import React from "react";
import { Form } from "react-bootstrap";

const Label = (props) => {
    return (
      <>   
        <Form.Label>{props.title}</Form.Label>
      </>
    )
  };
  
  export default Label;