import React from "react";
import { Row, Col } from "react-bootstrap";
import getColor, { Colors } from "../../../_utils/colors";
import { convert24hto12h } from "../../../_utils/utilities";

const SlotGenerator = (props) => {
  const userType = 2;
  return (
    <Row style={{ display: "flex", flexDirection: "row", marginBottom: "5px" }}>
      <Col xs="1" sm="1" className="slot-timings-title">
        {convert24hto12h(props.label)}
      </Col>
      <Col>
        {props.selectedSlots &&
          props.slots.map((slot, key) => {
            return (
              <button
                key={key}
                style={{
                  backgroundColor: props.updateSlots
                    ? props.selectedSlots.indexOf(slot.slot_id) > -1
                      ? Colors.primaryColor
                      : Colors.white
                    : getColor(slot),
                }}
                className={`slot-timings-button ${
                  props.selectedSlots.indexOf(slot.slot_id) > -1 &&
                  props.slotsAllDay.indexOf(slot.slot_id) > -1
                    ? "active"
                    : ""
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
                    color: props.updateSlots
                      ? props.selectedSlots.indexOf(slot.slot_id) > -1
                        ? Colors.white
                        : Colors.black
                      : props.selectedSlots.indexOf(slot.slot_id) > -1 &&
                        props.slotsAllDay.indexOf(slot.slot_id) > -1
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
