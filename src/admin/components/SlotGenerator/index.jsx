import React from "react";

import { Row, Col } from "react-bootstrap";
// import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import getColor from "../../../_utils/colors";
import { convert24hto12h } from "../../../_utils/utilities";
import "./SlotGenerator.scss"

const SlotGenerator = (props) => {
//   const userType = JSON.parse(getData("USER_TYPE"));
  const userType = 2;

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
                className={`slot-timings-button ${
                  props.selectedSlots.indexOf(slot.slot_id) > -1 ? "active-slot" : ""
                }`}
                onClick={(e) => {
                  userType === 2
                    ? props.handleSlotClick(slot.slot_id, slot.start)
                    : slot.status === "available" &&
                      props.handleSlotClick(slot.slot_id, slot.start);
                }}
              >
                <span
                  className="slot-timings-button-text"
                  style={{
                    color:
                      props.selectedSlots.indexOf(slot.slot_id) > -1
                        ? "white"
                        : "",
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
export default SlotGenerator;
