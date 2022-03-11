import React from "react";
import SidebarNav from "../sidebar";
import { useEffect, useState } from "react";
import moment from "moment";
import { Row, Col, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { fetchApi } from "../../../_utils/http-utils";
import HorizontalCalendar from "./HorizontalCalendar";
import CustomButton from "../CustomButton";
import back_icon from "../../assets/images/blackArrow.svg";
import SlotGenerator from "./SlotGenerator";
import {
  changeCaseFirstLetter,
  convert24hto12h,
} from "../../../_utils/common-utils";
import {
  renderAppointment,
} from "../../../_utils/data-table-utils";
import { isEmpty } from "lodash";

const SlotBooking = (props) => {
  const [startTime, setStartTime] = useState("");
  const [slotId, setSlotId] = useState("");
  const [slot, setSlot] = useState("");
  const [dataMorningShift, setDataMorningShift] = useState([]);
  const [dataEveningShift, setDataEveningShift] = useState([]);
  const [appoinmentDetails, setAppoinmentDetails] = useState({});
  const [currentDate, setCurrentDate] = useState(
    `${moment().format("YYYY-MM-DD")}`,
    "YYYY-MM-DD"
  );
  const [selectedDay, setSelectedDay] = useState(
    moment(currentDate).format("DD")
  );

  useEffect(() => {
    setSlot("");
    getAppoinmentDetails();
    setStartTime(moment().format('YYYY-MM-DD'));
  }, []);

  useEffect(() => {
    getSlots();
    return () => {};
  }, [currentDate]);

  async function handleNextClick() {
    const isValid = validation();
    if(isValid){
      let params = {
        appointment_id: props.match.params.appoinment_id,
        slot: startTime,
        slot_id: slotId,
        date: currentDate
      };
      try {
        let result = await fetchApi({
          url: "v1/appointment/rescheduleAppointment",
          method: "POST",
          body: params,
        });
        if (result.status === 200) {
          toast.success(result.message);
          setTimeout(() => {
            props.history.push('/appointment-list')
          }, 1000);
        } else {
          toast.error(result.message);
        }
      } catch (e) {
        toast.error(e.error);
      }
    }
  }

  function validation() {
    if (isEmpty(currentDate)) {
      toast.error("Please select the day");
      return false;
    } else if (!slot) {
      toast.error("Please select the slot");
      return false;
    } else {
      return true;
    }
  }

  function setDateValue(date) {
    const selectedDate = `${moment(date).format("YYYY-MM-DD")}`;
    setCurrentDate(selectedDate);
    setSelectedDay(moment(date).format("DD"));
    setDate(selectedDate);
    setSlot("");
  }

  function setSlotData(id, startTime) {
    setSlot(id);
    setSlotId(id);
    setStartTime(startTime);
  }

  const onDateSelect = (dateNumber, date) => {
    const selectedDate = `${moment(date).format("YYYY-MM-DD")}`;
    setCurrentDate(selectedDate);
    setSelectedDay(dateNumber);
    setDate(date);
    setSlot("");
  };

  function getGroupWiseDate(data) {
    return data.reduce((r, a) => {
      r[a.time] = [...(r[a.time] || []), a];
      return r;
    }, {});
  }

  async function getAppoinmentDetails() {
    let params = {
      appointment_id: props.match.params.appoinment_id,
    };
    try {
      let result = await fetchApi({
        url: "v1/appointment/getDetails",
        method: "POST",
        body: params,
      });
      if (result.status === 200) {
        setAppoinmentDetails(result.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.error);
    }
  }

  async function getSlots() {
    let params = {
      doctor_id: props.match.params.doctor_id,
      look_ahead:false,
      date: currentDate,
    };

    try {
      let result = await fetchApi({
        url: "v1/slot/getAvailableSlots",
        method: "POST",
        body: params,
      });
      if (result.status === 200) {
        if (result.data.shift1) {
          let data = result.data.shift1.map((info) => {
            const time = info.start.split(":");
            info.timeInNumber = time[0];
            info.time = time[0];
            return info;
          });
          const group = getGroupWiseDate(data);
          setDataMorningShift(group);
        }
        if (result.data.shift2) {
          let data = result.data.shift2.map((info) => {
            const time = info.start.split(":");
            info.timeInNumber = time[0];
            info.time = time[0];
            return info;
          });
          const group = getGroupWiseDate(data);
          setDataEveningShift(group);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.error);
    }
  }

  const dayShiftSlot = () => {
    return Object.entries(dataMorningShift)
      .sort()
      .map((timeSlot) => {
        return (
          <SlotGenerator
            selectedSlots={[slot]}
            handleSlotClick={setSlotData}
            label={`${convert24hto12h(timeSlot[0])}`}
            slots={timeSlot[1]}
          />
        );
      });
  };

  const EveningShiftSlot = () => {
    return Object.entries(dataEveningShift).map((timeSlot) => {
      return (
        <SlotGenerator
          selectedSlots={[slot]}
          handleSlotClick={setSlotData}
          label={`${convert24hto12h(timeSlot[0])}`}
          slots={timeSlot[1]}
        />
      );
    });
  };
  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* <button className="back-nav-container back-navigation">
                    <img src={back_icon} alt='back_icon-img' onClick={() =>  props.history.goBack()}></img>
                    <span>Book Slot</span>
                </button> */}
          <Row className="pb-1">
            <Col lg="6" xs="12">
              <span className="slot-details">Appoinment Time : </span>{" "}
              <span className="slot-details-info">
                {!isEmpty(appoinmentDetails) &&
                  renderAppointment(
                    appoinmentDetails.time.utc_time,
                    appoinmentDetails.time.slot
                  )}
              </span>
            </Col>
            <Col lg="6" xs="12">
              <span className="slot-details">Patient Name : </span>
              {!isEmpty(appoinmentDetails) && (
                <span className="slot-details-info">{`${changeCaseFirstLetter(
                  appoinmentDetails.patient.user.first_name
                )} ${changeCaseFirstLetter(
                  appoinmentDetails.patient.user.last_name
                )}`}</span>
              )}
            </Col>
          </Row>
          <Row className="pb-5">
            <Col lg="6" xs="12">
              <span className="slot-details">Doctor Name : </span>
              {!isEmpty(appoinmentDetails) && (
                <span className="slot-details-info">{`Dr ${changeCaseFirstLetter(
                  appoinmentDetails.doctor.first_name
                )} ${changeCaseFirstLetter(
                  appoinmentDetails.doctor.last_name
                )}`}</span>
              )}
            </Col>
            <Col lg="6" xs="12">
              <span className="slot-details">Reason : </span>
              <span className="slot-details-info">{!isEmpty(appoinmentDetails) && appoinmentDetails.reason}</span>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xs="12" className="screen-768">
              <HorizontalCalendar
                date={currentDate}
                numberOfDays={15}
                selectedDay={selectedDay}
                setDateValue={setDateValue}
                setSelectedDay={onDateSelect}
                slot_id={slot}
              />
              {Object.entries(dataMorningShift).length > 0 && (
                <Row
                  className="slot-day"
                  style={{ marginTop: "30px", marginBottom: "32px" }}
                >
                  <Col lg="3">
                    <span className="H4">Day Shift</span>
                  </Col>
                </Row>
              )}
              {Object.entries(dataMorningShift).length > 0 && dayShiftSlot()}
              <div className="slot-evening">
                {Object.entries(dataEveningShift).length > 0 && (
                  <Row style={{ marginTop: "30px", marginBottom: "32px" }}>
                    <Col lg="3">
                      <span className="H4">Evening Shift</span>
                    </Col>
                  </Row>
                )}
                {Object.entries(dataEveningShift).length > 0 &&
                  EveningShiftSlot()}
              </div>
              {Object.entries(dataMorningShift).length > 0 ||
              Object.entries(dataEveningShift).length > 0 ? (
                <div style={{ textAlign: "center" }}>
                  <CustomButton
                    className={"patient-slot-booking-btn"}
                    onClick={handleNextClick}
                    text={"Next"}
                  ></CustomButton>
                </div>
              ) : (
                <div className="empty-text">
                  <Form.Label>
                    Sorry!, No slots available, please choose another date
                  </Form.Label>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default SlotBooking;
