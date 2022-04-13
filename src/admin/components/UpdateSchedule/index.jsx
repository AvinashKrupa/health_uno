import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import UpdateScheduleHorizontalCalendar from "./UpdateScheduleHorizontalCalendar";
// import updateScheduleStore from "../../store/updateScheduleStore";
import { fetchApi } from "../../../_utils/http-utils";
// import {API, post} from "../../../api/config/APIController";
import UpdateSlotGenerator from "./UpdateSlotGenerator";
import { getData } from "../../../_utils/localStorage/LocalAsyncStorage";
import { constants, convert24hto12h } from "../../../_utils/common-utils";
import Checkbox from "../../commons/Checkbox";
import _, { identity } from "lodash";
import SlotGenerator from "./SlotGenerator";

const UpdateSchedule = ({ data }) => {
  const [selectedDays, setSelectedDays] = useState([
    { day: "Sunday", isChecked: false },
    { day: "Monday", isChecked: false },
    { day: "Tuesday", isChecked: false },
    { day: "Wednesday", isChecked: false },
    { day: "Thursday", isChecked: false },
    { day: "Friday", isChecked: false },
    { day: "Saturday", isChecked: false },
  ]);
  const [slotsAllDay, setSlotsAllDay] = useState([]);
  const [isAllDay, setIsAllDay] = useState(false);
  const [daySlots, setDaySlots] = useState([]);
  const [dataMorningShiftAllDay, setDataMorningShiftAllDay] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [dataEveningShiftAllDay, setDataEveningShiftAllDay] = useState([]);
  const [isDayShift, setIsDayShift] = useState(false);
  const [isEveningShift, setIsEveningShift] = useState(false);
  const [dayShiftFrom, setDayShiftFrom] = useState("");
  const [dayShiftTo, setDayShiftTo] = useState("");
  const [eveningShiftFrom, setEveningShiftFrom] = useState("");
  const [eveningShiftTo, setEveningShiftTo] = useState("");
  const [shouldShowButton, setShouldShowButton] = useState(false);

  // const {addToast} = useToasts();
  // const setDate = updateScheduleStore((state) => state.setDate);
  const [slotId, setSlotId] = useState("");
  // const setStartTime = updateScheduleStore((state) => state.setStartTime);
  const [startTime, setStartTime] = useState("");
  // const [slot, setSlot] = useState(updateScheduleStore((state) => state.slot_id));
  const [slot, setSlot] = useState("");
  const [dataMorningShift, setDataMorningShift] = useState([]);
  const [dataEveningShift, setDataEveningShift] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    `${moment().format("YYYY-MM-DD")}`,
    "YYYY-MM-DD"
  );
  const [selectedDay, setSelectedDay] = useState(
    moment(currentDate).format("DD")
  );

  useEffect(() => {
    if (isAllDay) {
      setSelectedDays(
        selectedDays.map((item) => {
          item.isChecked = true;
          return item;
        })
      );
    }
  }, [isAllDay]);

  useEffect(() => {
    let dayCounter = 0;
    selectedDays.map((item) => {
      if (item.isChecked) {
        dayCounter++;
      }
    });
    //  setIsAllDay(dayCounter == 7 ? true : false);
  }, [selectedDays]);

  useEffect(() => {
    if (validateSlots(1)) getSlotsAllDay(1, dayShiftFrom, dayShiftTo);
    return () => {};
  }, [dayShiftFrom, dayShiftTo, isDayShift]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (validateSlots(2)) getSlotsAllDay(2, eveningShiftFrom, eveningShiftTo);

    return () => {};
  }, [eveningShiftFrom, eveningShiftTo, isEveningShift]); // eslint-disable-line react-hooks/exhaustive-deps

  function validateSlots(type) {
    let momentShift1From, momentShift1To;
    let momentShift2From, momentShift2To;
    switch (type) {
      case 1:
        if (dayShiftFrom === "" || dayShiftTo === "") return true;
        momentShift1From = moment(dayShiftFrom, "HH:mm");
        momentShift1To = moment(dayShiftTo, "HH:mm");
        if (!momentShift1From.isBefore(momentShift1To)) {
          toast.error("Morning shift start time cannot be after end time", {
            appearance: "error",
          });
          return false;
        }
        if (eveningShiftFrom !== "" && eveningShiftTo !== "") {
          momentShift2From = moment(eveningShiftFrom, "HH:mm");
          if (!momentShift1To.isBefore(momentShift2From)) {
            toast.error(
              "Morning shift end time cannot be after evening shift start time",
              { appearance: "error" }
            );
            return false;
          }
        }
        return true;
      case 2:
        if (eveningShiftFrom === "" || eveningShiftTo === "") return true;
        momentShift2From = moment(eveningShiftFrom, "HH:mm");
        momentShift2To = moment(eveningShiftTo, "HH:mm");
        if (!momentShift2From.isBefore(momentShift2To)) {
          toast.error("Evening shift start time cannot be after end time", {
            appearance: "error",
          });
          return false;
        }
        if (dayShiftFrom !== "" && dayShiftTo !== "") {
          momentShift1To = moment(dayShiftTo, "HH:mm");
          if (!momentShift1To.isBefore(momentShift2From)) {
            toast.error(
              "Evening shift start time cannot be earlier than morning shift end time",
              { appearance: "error" }
            );
            return false;
          }
        }
        return true;
      default:
        toast.error("It should not come here", { appearance: "error" });
    }
  }

  useEffect(() => {
    getDoctorDetails();
    getSlots();
    return () => {};
  }, [currentDate]);

  useEffect(() => {
    if (isEveningShift || isDayShift) {
      setShouldShowButton(true);
    } else {
      setShouldShowButton(false);
    }
  }, [isDayShift, isEveningShift]);

  function setDateValue(date) {
    const selectedDate = `${moment(date).format("YYYY-MM-DD")}`;
    setCurrentDate(selectedDate);
    setSelectedDay(moment(date).format("DD"));
    //setDate(selectedDate);
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
    //setDate(date);
    setSlot("");
  };

  function getGroupWiseDate(data) {
    return data.reduce((r, a) => {
      r[a.time] = [...(r[a.time] || []), a];
      return r;
    }, {});
  }

  const handleDaysClick = (index) => {
    let data = JSON.parse(JSON.stringify(selectedDays));
    data[index].isChecked = !data[index].isChecked || false;
    setSelectedDays(data);
    const isAnyChecked = _.some(data, { isChecked: true });
    if (isAnyChecked) {
      setShouldShowButton(true);
    } else {
      setShouldShowButton(false);
    }
  };

  function updateSchedule(timeSlot) {
    let params = null;
    if (timeSlot.status === "unavailable") {
      params = {
        unavailable_slots: [],
        available_slots: [timeSlot.slot_id],
        date: moment(currentDate).format("YYYY-MM-DD"),
        doctor_id: data.additional_info._id,
      };
    } else if (timeSlot.status === "available") {
      params = {
        unavailable_slots: [timeSlot.slot_id],
        available_slots: [],
        date: moment(currentDate).format("YYYY-MM-DD"),
        doctor_id: data.additional_info._id,
      };
    } else {
      toast.error("This slot already have an appointment");
      return;
    }
    fetchApi({ url: "v1/doctor/updateSchedule", body: params, method: "POST" })
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            getSlots();
            toast.success(response.data.message);
          } else {
            toast.success(response.message);
            getSlots();
          }
        } else {
          toast.error("error occurred");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  function updateAvailabilityByDays() {
    let slots = [];

    if (isDayShift) {
      slots = [...slots, ...daySlots];
    }

    if (isEveningShift) {
      slots = [...slots, ...eveningSlots];
    }

    let params = {
      avail: {
        day: {
          sun: selectedDays[0].isChecked,
          mon: selectedDays[1].isChecked,
          tue: selectedDays[2].isChecked,
          wed: selectedDays[3].isChecked,
          thu: selectedDays[4].isChecked,
          fri: selectedDays[5].isChecked,
          sat: selectedDays[6].isChecked,
        },
        shift: {
          ...(isDayShift
            ? {
                shift1: {
                  start: moment(
                    `${moment().format("DD-MMM-YYYY")} ${dayShiftFrom}`
                  ).format("HH:mm"),
                  end: moment(
                    `${moment().format("DD-MMM-YYYY")} ${dayShiftTo}`
                  ).format("HH:mm"),
                },
              }
            : {
                shift1: {
                  start: "",
                  end: "",
                },
              }),
          ...(isEveningShift
            ? {
                shift2: {
                  start: moment(
                    `${moment().format("DD-MMM-YYYY")} ${eveningShiftFrom}`
                  ).format("HH:mm"),
                  end: moment(
                    `${moment().format("DD-MMM-YYYY")} ${eveningShiftTo}`
                  ).format("HH:mm"),
                },
              }
            : {
                shift2: {
                  start: "",
                  end: "",
                },
              }),
        },
      },
      user_id: data.user._id,
      type: constants.USER_TYPE_DOCTOR,
    };
    if (isAllDay) {
      params.avail.slots = slots;
    }
    fetchApi({
      url: "v1/user/updateProfile",
      method: "POST",
      body: params,
    })
      .then((response) => {
        if (response.status === 200) {
          getSlots();
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  }

  function getSlots() {
    let params = {
      doctor_id: data.additional_info._id,
      look_ahead: false,
      date: currentDate,
    };

    fetchApi({
      url: "v1/slot/getAvailableSlots",
      method: "POST",
      body: params,
    })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.shift1) {
            let data = response.data.shift1.map((info) => {
              const time = info.start.split(":");
              info.timeInNumber = time[0];
              info.time = time[0];
              return info;
            });
            const group = getGroupWiseDate(data);
            setDataMorningShift(group);
          }
          if (response.data.shift2) {
            let data = response.data.shift2.map((info) => {
              const time = info.start.split(":");
              info.timeInNumber = time[0];
              info.time = time[0];
              return info;
            });
            const group = getGroupWiseDate(data);
            setDataEveningShift(group);
          }
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  }

  function getDoctorDetails() {
    fetchApi({
      url: "v1/doctor/getDoctorDetails",
      method: "POST",
      body: {
        doctor_id: data.additional_info._id,
        include_similar: true,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          let dataDay = [
            { day: "Sunday", isChecked: false },
            { day: "Monday", isChecked: false },
            { day: "Tuesday", isChecked: false },
            { day: "Wednesday", isChecked: false },
            { day: "Thursday", isChecked: false },
            { day: "Friday", isChecked: false },
            { day: "Saturday", isChecked: false },
          ];
          //    setSlotsAllDay(response?.data?.slots);
          let days = response.data.day;
          let shift = response.data.shift;
          let dayCounter = 0;
          Object.keys(days).forEach((info, index) => {
            if (index < 7) {
              dataDay[index].isChecked = days[info];
              if (days[info]) {
                dayCounter++;
              }
            }
          });
          if (shift.shift1 && shift.shift1.start != "") {
            setDayShiftFrom(shift.shift1.start);
            setDayShiftTo(shift.shift1.end);
            setIsDayShift(true);
          }
          if (shift.shift2 && shift.shift2.start != "") {
            setEveningShiftFrom(shift.shift2.start);
            setEveningShiftTo(shift.shift2.end);
            setIsEveningShift(true);
          }
          setSelectedDays(JSON.parse(JSON.stringify(dataDay)));
          // if (dayCounter == 7) {
          //   setIsAllDay(true);
          // }
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  }

  const dayShiftSlot = () => {
    return Object.entries(dataMorningShift)
      .sort()
      .map((timeSlot) => {
        return (
          <UpdateSlotGenerator
            selectedSlots={[slot]}
            handleSlotClick={updateSchedule}
            label={`${convert24hto12h(timeSlot[0])}`}
            slots={timeSlot[1]}
          />
        );
      });
  };

  const EveningShiftSlot = () => {
    return Object.entries(dataEveningShift).map((timeSlot) => {
      return (
        <UpdateSlotGenerator
          selectedSlots={[slot]}
          handleSlotClick={updateSchedule}
          label={`${convert24hto12h(timeSlot[0])}`}
          slots={timeSlot[1]}
        />
      );
    });
  };

  const renderUpdateByDate = () => {
    return (
      <>
        <Row>
          <span className="section-sub-title">By Date</span>
        </Row>
        <Row>
          <UpdateScheduleHorizontalCalendar
            date={currentDate}
            numberOfDays={15}
            selectedDay={selectedDay}
            setDateValue={setDateValue}
            setSelectedDay={onDateSelect}
            slot_id={slot}
          />
        </Row>
        {Object.entries(dataMorningShift).length > 0 && (
          <div>
            <Row
              className="slot-day"
              style={{ marginTop: "30px", marginBottom: "32px" }}
            >
              <Col lg="12">
                <span className="shift-name">Day Shift</span>
              </Col>
            </Row>
          </div>
        )}
        {Object.entries(dataMorningShift).length > 0 && dayShiftSlot()}
        <div className="slot-evening">
          {Object.entries(dataEveningShift).length > 0 && (
            <Row style={{ marginTop: "30px", marginBottom: "32px" }}>
              <Col lg="3">
                <span className="shift-name">Evening Shift</span>
              </Col>
            </Row>
          )}
          {Object.entries(dataEveningShift).length > 0 && EveningShiftSlot()}
        </div>
        {!Object.entries(dataMorningShift).length &&
          !Object.entries(dataEveningShift).length && (
            <div className="empty-list-container_center">
              <h4>No slots found, please choose another date</h4>
            </div>
          )}
      </>
    );
  };

  const renderGeneralAvailability = () => {
    return (
      <>
        <Row>
          <Col>
            <span style={{ marginTop: "32px" }} className="section-sub-title">
              General Availability
            </span>
          </Col>
          <Col>
            <InputGroup>
              <span className="all-day-slot">All days</span>
              <div
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginLeft: "20%",
                }}
              >
                <Checkbox
                  id="all-day-term"
                  checked={isAllDay}
                  handleSelect={() => {
                    if (!isAllDay) {
                      if (validateSlots(2))
                        getSlotsAllDay(2, eveningShiftFrom, eveningShiftTo);
                      if (validateSlots(1))
                        getSlotsAllDay(1, dayShiftFrom, dayShiftTo);
                    }
                    setIsAllDay(!isAllDay);
                  }}
                />
              </div>
            </InputGroup>
          </Col>
        </Row>
        <Row className={"days-selection-container"}>
          {selectedDays.map((item, index) => {
            let active = item.isChecked;
            return (
              <Button
                className={"days-selection-button"}
                onClick={(e) => handleDaysClick(index)}
                style={{ backgroundColor: active ? "#28A3DA" : "white" }}
              >
                <span
                  className="days-button-text"
                  style={{ color: active ? "white" : "black" }}
                >
                  {item.day}
                </span>
              </Button>
            );
          })}
        </Row>
        <Row>
          <Col lg="3">
            <InputGroup>
              <span className="shift-name">Day Shift</span>
              <div
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginLeft: "20%",
                }}
              >
                <Checkbox
                  id="term"
                  checked={isDayShift}
                  handleSelect={setIsDayShift}
                />
              </div>
            </InputGroup>
          </Col>
          <Col></Col>
          {isDayShift && (
            <Col className="time-select">
              <Form.Control
                type="time"
                placeholder="From"
                className="shift-timings-input"
                value={dayShiftFrom}
                onChange={(e) => {
                  setDayShiftFrom(e.target.value);
                }}
              />

              <Form.Control
                type="time"
                style={{ marginLeft: "5%" }}
                placeholder="To"
                className="shift-timings-input"
                value={dayShiftTo}
                onChange={(e) => setDayShiftTo(e.target.value)}
              />
            </Col>
          )}
        </Row>
        {isAllDay && isDayShift && dayShiftSlotAllDay()}
        <div className="slot-evening">
          <Row>
            <Col lg="3">
              <InputGroup>
                <span className="shift-name">Evening Shift</span>
                <div
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: "20%",
                  }}
                >
                  <Checkbox
                    id="term"
                    checked={isEveningShift}
                    handleSelect={setIsEveningShift}
                  />
                </div>
              </InputGroup>
            </Col>
            <Col> </Col>
            {isEveningShift && (
              <Col className="time-select">
                <Form.Control
                  type="time"
                  placeholder="From"
                  value={eveningShiftFrom}
                  className="shift-timings-input"
                  onChange={(e) => setEveningShiftFrom(e.target.value)}
                />
                <Form.Control
                  type="time"
                  placeholder="To"
                  value={eveningShiftTo}
                  style={{ marginLeft: "5%" }}
                  className="shift-timings-input"
                  onChange={(e) => setEveningShiftTo(e.target.value)}
                />
              </Col>
            )}
          </Row>
          {isAllDay && isEveningShift && EveningShiftSlotAllDay()}
          <Row style={{ justifyContent: "center" }}>
            <Button
              className="update-button"
              style={{ visibility: !shouldShowButton ? "hidden" : "unset" }}
              onClick={() => updateAvailabilityByDays()}
            >
              Update
            </Button>
          </Row>
        </div>
      </>
    );
  };

  function getSlotsAllDay(type, from, to) {
    const date = moment(`${currentDate}`, "DD-MM-YYYY").format("YYYY-MM-DD");
    let fromDate = `${date}T${from}:00.000+05:30`;
    let toDate = `${date}T${to}:59.999+05:30`;
    let params = {
      start: fromDate,
      end: toDate,
    };
    fetchApi({
      url: "v1/slot/getSlots",
      method: "POST",
      body: params,
    })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.map((info) => {
            const time = info.start.split(":");
            info.timeInNumber = time[0];
            info.time = time[0];
            return info;
          });

          let slotIds = data.map((slot) => slot.slot_id);

          let group = data.reduce((r, a) => {
            r[a.time] = [...(r[a.time] || []), a];
            return r;
          }, {});
          if (type === 1) {
            setDataMorningShiftAllDay(group);
            setDaySlots([...slotIds]);
          } else {
            setDataEveningShiftAllDay(group);
            setEveningSlots([...slotIds]);
          }
        } else {
          toast.error(response.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        toast.error(error?.message, { appearance: "error" });
      });
  }
  const handleDaySlotClick = (id) => {
    const list = JSON.parse(JSON.stringify(daySlots));
    const index = list.indexOf(id);

    if (index > -1) {
      list.splice(index, 1);
      setDaySlots(list);
    } else {
      setDaySlots([...list, id]);
    }
    console.log("Data", daySlots);
  };

  const handleEveningSlotClick = (id) => {
    const list = JSON.parse(JSON.stringify(eveningSlots));
    const index = list.indexOf(id);

    if (index > -1) {
      list.splice(index, 1);
      setEveningSlots(list);
    } else {
      setEveningSlots([...list, id]);
    }
  };

  const dayShiftSlotAllDay = () => {
    return Object.entries(dataMorningShiftAllDay)
      .sort()
      .map((timeSlot, index) => {
        return (
          <SlotGenerator
            key={index}
            slotsAllDay={slotsAllDay}
            selectedSlots={daySlots}
            handleSlotClick={handleDaySlotClick}
            label={`${timeSlot[0]}`}
            slots={timeSlot[1]}
            updateSlots={true}
          />
        );
      });
  };

  const EveningShiftSlotAllDay = () => {
    return Object.entries(dataEveningShiftAllDay).map((timeSlot, index) => {
      return (
        <SlotGenerator
          key={index}
          slotsAllDay={slotsAllDay}
          selectedSlots={eveningSlots}
          handleSlotClick={handleEveningSlotClick}
          label={`${timeSlot[0]}`}
          slots={timeSlot[1]}
          updateSlots={true}
        />
      );
    });
  };

  return (
    <>
      <Row className="update-schedule-container">
        <Col lg="12" md="12" sm="6" xs="6">
          {renderGeneralAvailability()}
          {renderUpdateByDate()}
        </Col>
      </Row>
    </>
  );
};
export default UpdateSchedule;
