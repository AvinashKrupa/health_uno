import React from 'react'
import { Button } from "react-bootstrap";

const CustomButton = ({text, disabled, onClick, className, type, importantStyle, showLoader}) => {
    return (
      <>
        <Button style={importantStyle} className={`button ${className}`} type={type} disabled={disabled} onClick={onClick}>
            {text}</Button>
      </>
    );
  };

  export default CustomButton;

