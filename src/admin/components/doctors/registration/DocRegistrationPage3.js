import React, {useEffect, useState} from "react";
import moment from 'moment';
import {Row, Col, Button, Form, InputGroup} from "react-bootstrap";
import SlotGenerator from "../slot/SlotGenerator";
import Checkbox from '../../../commons/Checkbox'
import { fetchApi } from "../../../../_utils/http-utils";
import toast from "react-hot-toast";

const DocRegistrationPage3 = (props) => {

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const {
        selectedDays, daySlots, eveningSlots, isDayShift, isEveningShift, dayShiftFrom,
        dayShiftTo, eveningShiftFrom, eveningShiftTo, dataMorningShift,
        dataEveningShift, setSelectedDays, setDaySlots, setEveningSlots, setIsDayShift,
        setIsEveningShift, setDayShiftFrom, setDayShiftTo, setEveningShiftFrom, setEveningShiftTo,
        setDataMorningShift, setDataEveningShift
    } = props;
    const [currentDate] = useState(moment().format('DD-MM-YYYY'));

    useEffect(() => {
        if (validateSlots(1))
            getSlots(1, dayShiftFrom, dayShiftTo);
        return () => {
        };
    }, [dayShiftFrom, dayShiftTo, isDayShift]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        if (validateSlots(2))
            getSlots(2, eveningShiftFrom, eveningShiftTo);

        return () => {
        };
    }, [eveningShiftFrom, eveningShiftTo, isEveningShift]); // eslint-disable-line react-hooks/exhaustive-deps

    function validateSlots(type) {
        let momentShift1From, momentShift1To;
        let momentShift2From, momentShift2To;
        switch (type) {
            case 1:
                if (dayShiftFrom === "" || dayShiftTo === "")
                    return true
                momentShift1From = moment(dayShiftFrom, "HH:mm")
                momentShift1To = moment(dayShiftTo, "HH:mm")
                if (!momentShift1From.isBefore(momentShift1To)) {
                    toast.error("Morning shift start time cannot be after end time", {appearance: 'error'});
                    return false
                }
                if (eveningShiftFrom !== "" && eveningShiftTo !== "") {
                    momentShift2From = moment(eveningShiftFrom, "HH:mm")
                    if (!momentShift1To.isBefore(momentShift2From)) {
                        toast.error("Morning shift end time cannot be after evening shift start time", {appearance: 'error'});
                        return false
                    }
                }
                return true
            case 2:

                if (eveningShiftFrom === "" || eveningShiftTo === "")
                    return true
                momentShift2From = moment(eveningShiftFrom, "HH:mm")
                momentShift2To = moment(eveningShiftTo, "HH:mm")
                if (!momentShift2From.isBefore(momentShift2To)) {
                    toast.error("Evening shift start time cannot be after end time", {appearance: 'error'});
                    return false
                }
                if (dayShiftFrom !== "" && dayShiftTo !== "") {
                    momentShift1To = moment(dayShiftTo, "HH:mm")
                    if (!momentShift1To.isBefore(momentShift2From)) {
                        toast.error("Evening shift start time cannot be earlier than morning shift end time", {appearance: 'error'});
                        return false
                    }
                }
                return true
            default:
                toast.error("It should not come here", { appearance: 'error' });

        }


    }

    const handleDaysClick = (id) => {
        const list = JSON.parse(JSON.stringify(selectedDays));
        const index = list.indexOf(id);

        if (index > -1) {
            list.splice(index, 1);
            setSelectedDays(list)
        } else {
            setSelectedDays([...list, id])
        }

    };

    function getSlots(type, from, to) {
        const date = moment(`${currentDate}`, 'DD-MM-YYYY').format('YYYY-MM-DD')
        let fromDate = `${date}T${from}:00.000+05:30`;
        let toDate = `${date}T${to}:59.999+05:30`;
        ;

        let params = {
            start: fromDate,
            end: toDate,
        };
            fetchApi({
                url: "v1/slot/getSlots",
                method: "POST",
                body: params,
            })
            .then(response => {
                if (response.status === 200) {
                    let data = response.data.map(info => {
                        const time = info.start.split(":")
                        info.timeInNumber = time[0]
                        info.time = time[0];
                        return info;
                    });

                    let slotIds = data.map(slot => slot.slot_id)


                    let group = data.reduce((r, a) => {
                        r[a.time] = [...r[a.time] || [], a];
                        return r;
                    }, {});
                    if (type === 1) {
                        setDataMorningShift(group);
                        setDaySlots([...slotIds])
                    } else {
                        setDataEveningShift(group);
                        setEveningSlots([...slotIds])
                    }
                } else {
                    toast.error(response.message, { appearance: 'error' });
                }
            })
            .catch(error => {

                toast.error(error.response.message, { appearance: 'error' });
            });
    }

    const handleDaySlotClick = (id) => {
        const list = JSON.parse(JSON.stringify(daySlots));
        const index = list.indexOf(id);

        if (index > -1) {
            list.splice(index, 1);
            setDaySlots(list)
        } else {
            setDaySlots([...list, id])
        }

    };

    const handleEveningSlotClick = (id) => {
        const list = JSON.parse(JSON.stringify(eveningSlots));
        const index = list.indexOf(id);

        if (index > -1) {
            list.splice(index, 1);
            setEveningSlots(list)
        } else {
            setEveningSlots([...list, id])
        }

    };

    const dayShiftSlot = () => {
        return Object.entries(dataMorningShift).sort().map((timeSlot,index) => {
            return (
                <SlotGenerator key={index} selectedSlots={daySlots} handleSlotClick={handleDaySlotClick} label={`${timeSlot[0]}`}
                               slots={timeSlot[1]}/>
            )
        })
    };

    const EveningShiftSlot = () => {
        return Object.entries(dataEveningShift).map((timeSlot,index) => {
            return (
                <SlotGenerator key={index} selectedSlots={eveningSlots} handleSlotClick={handleEveningSlotClick}
                               label={`${timeSlot[0]}`} slots={timeSlot[1]}/>
            )
        })
    }

    return (
        <>
            <Row>
                <Col lg='1'></Col>
                <Col lg='10'>
                    <Row>
                        <span style={{marginBottom: "10px"}} className="H3">Select available timings</span>
                    </Row>
                    <Row style={{display: "flex", flexDirection: "row"}}>
                        {days.map((day,index) => {
                            let active = selectedDays.includes(day);
                            return (
                                <Button key={index} className={'reg-days-button'} onClick={() => handleDaysClick(day)}
                                        style={{backgroundColor: active ? '#28A3DA' : 'white'}}>
                                    <span className="days-button-text"
                                          style={{color: active ? "white" : ""}}>{day}</span>
                                </Button>
                            )
                        })}
                    </Row>
                    <Row>
                        <span style={{marginTop: "40px", marginBottom: "-15px"}} className="H3">Select available timings</span>
                    </Row>
                    <br/>
                    <Row>
                        <Col lg='3'>
                            <InputGroup>
                                <span className="H4">Day Shift</span>
                                <Checkbox id="term" checked={isDayShift} handleSelect={setIsDayShift}/>
                            </InputGroup>
                        </Col>
                        <Col></Col>
                        <Col className='time-select'>
                            <Form.Control
                                type="time"
                                placeholder="From"
                                disabled={!isDayShift}
                                className="shift-timings-input"
                                onChange={(e) => setDayShiftFrom(e.target.value)}
                            />

                            <Form.Control
                                type="time"
                                placeholder="To"
                                disabled={!isDayShift}
                                className="shift-timings-input"
                                onChange={(e) => setDayShiftTo(e.target.value)}
                            />
                        </Col>
                    </Row>
                    {isDayShift && dayShiftSlot()}
                    <div className='slot-evening'>
                        <Row>
                            <Col lg='3'>
                                <InputGroup>
                                    <span className="H4">Evening Shift</span>
                                    <Checkbox id="term" checked={isEveningShift} handleSelect={setIsEveningShift}/>
                                </InputGroup>
                            </Col>
                            <Col> </Col>
                            <Col className='time-select'>
                                <Form.Control
                                    type="time"
                                    placeholder="From"
                                    disabled={!isEveningShift}
                                    className="shift-timings-input"
                                    onChange={(e) => setEveningShiftFrom(e.target.value)}
                                />
                                <Form.Control
                                    type="time"
                                    placeholder="To"
                                    disabled={!isEveningShift}
                                    className="shift-timings-input"
                                    onChange={(e) => setEveningShiftTo(e.target.value)}
                                />
                            </Col>
                        </Row>
                        {isEveningShift && EveningShiftSlot()}
                    </div>
                </Col>
            </Row>
        </>
    );
};
export default DocRegistrationPage3;
