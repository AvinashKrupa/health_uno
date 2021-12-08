import React from "react";
import { Modal } from "react-bootstrap";
// import "../patient/styles/model.scss";
import CustomButton from "../commons/Button";

function ModalDialog(props) {
  const { show, closeDialog, title, children, onSubmit, btnText, isConfirm, modalClassName} =
    props;

  return (
    <>
      <Modal className={modalClassName} onHide={isConfirm && closeDialog} show={show}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
          <i
            class="far fa-times-circle"
            style={{ fontSize: "24px", color: "white" }}
            onClick={closeDialog}
          ></i>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          {isConfirm ? (
            <CustomButton onClick={closeDialog} text={"Ok"}></CustomButton>
          ) : (
            <>
              <button className={"card-text-close"} onClick={closeDialog}>
                {" "}
                Cancel
              </button>
              <CustomButton onClick={onSubmit} text={"Confirm"}></CustomButton>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDialog;
