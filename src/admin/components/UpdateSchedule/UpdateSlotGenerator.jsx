import React from 'react'
import { Col, Row } from "react-bootstrap";
// import { getData } from "../../../_utils/localStorage/LocalAsyncStorage";
import { getStorageData } from "../../../_utils/localStorage/LocalAsyncStorage";
import getColor from "../../../_utils/colors";
import { convert24hto12h } from "../../../_utils/common-utils";

const UpdateSlotGenerator = (props) => {
  const userType = getStorageData("USER_TYPE");
  return (
    <Row style={{ display: "flex", flexDirection: "row", marginBottom: "5px" }}>
      <Col xs="1" sm="1" className="slot-timings-title">
        {props.label}
      </Col>
      <Col>
        {props.selectedSlots &&
          props.slots.map((slot) => {
            return (
              <button
                style={{ backgroundColor: getColor(slot) }}
                style={{
                  backgroundColor:
                    slot.status === "available" ? "#28a3da" : "rgb(225, 225, 225)",
                }}
                className={`slot-timings-button ${
                  props.selectedSlots.indexOf(slot.slot_id) > -1 ? "active" : ""
                }`}
                onClick={(e) => {
                  props.handleSlotClick(slot)
                }}
              >
                <span
                  className="slot-timings-button-text"
                  style={{
                    color: slot.status === "available" ? "white" : "black",
                  }}
                >
                  {convert24hto12h(slot.start)}
                </span>
              </button>
            );
          })}
      </Col>
    </Row>
  );
};
export default UpdateSlotGenerator;
