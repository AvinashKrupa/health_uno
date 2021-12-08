import React, {forwardRef, memo, useEffect, useState} from 'react';
import moment from 'moment';
import { Button, Image} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendar from '../../assets/images/calendar.png';


const HorizontalCalendar = (props) => {
  const {slot_id, date, selectedDay, setDateValue, setSelectedDay} = props;
  const [dates, setDate] = useState([]);
  const size = window.screen.availWidth > 414 ? 7: 4

  const handleIndex = (dateValue) => {
    const selectedDateIndex = dates.findIndex(date => date === moment(dateValue).format("DD MMM YYYY"))
    const remainingData = selectedDateIndex%size
    const finalIndex =  selectedDateIndex - remainingData
    return finalIndex + size
  }

  const [lastIndex, setLastIndex] = useState(size);

  useEffect(() => {
    let datesArr = [];

    for (let i = 0; i < 30; i++) {
      let dateValue = moment().add(i, 'days').format('DD MMM YYYY').toString();
      datesArr.push(dateValue);
    }

    setDate(datesArr);

  }, [date]);


  useEffect(() => {
      if(selectedDay && dates.length){
        setLastIndex(handleIndex(date))
      }
  },[dates]);

  const handleDaysClick = (day, info) => {
    setSelectedDay(day, info);

};

const handleSelectedDate = (dateValue) => {
  setDateValue(dateValue)
  const selectedDateIndex = dates.findIndex(date => date === moment(dateValue).format("DD MMM YYYY"))
  const remainingData = selectedDateIndex%size
  const finalIndex =  selectedDateIndex - remainingData
  setLastIndex(finalIndex+size)
}

  const _renderDays = (info) => {
  let dateFormate = moment(`${info}`);
  const dateNumber = dateFormate.format('DD');
  const now = dateFormate.format('ddd');
  const month = dateFormate.format('MMM');
  const active = dateNumber === selectedDay;

  return (
        <>
          <Button className={'days-button'}
            style={{backgroundColor: active ? '#28A3DA': 'white'}}
            onClick={(e) =>  handleDaysClick(dateNumber, info)}
            >
          <span className="days-button-text" style={{color: active ? 'white': 'black'}}>{dateNumber} {now} { window.screen.availWidth >  700 && month}</span>
          </Button>
        </>
  );
};

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
 <>
  <span className="example-custom-input" onClick={onClick} ref={ref} style={{display: 'flex'}}>
    {moment(value).format("MMM YYYY")}<Image className='fa-calendar-alt-slot' src={calendar}></Image>
  </span>
  
 </>
));

  return (
      <div className='patient-slot-booking-cal' style={{display: 'flex', flexDirection: 'row'}}>
        <div className='patient-slot-booking'
            style={{ display: "flex", flexDirection: "row" }}
        >
            <i className="fas fa-chevron-left" onClick={() => {
                if(lastIndex > size) {
                    setLastIndex(lastIndex - size)
                }
            }}></i>

            {dates.slice(lastIndex - size, lastIndex).map(info => {
                 return _renderDays(info);
            })}

            <i className="fas fa-chevron-right"  onClick={() =>  {
                if(lastIndex < 30) {
                    setLastIndex(lastIndex + size)
                }
            }}></i>

        </div>
        <div className="slot-calendar" style={{display: 'flex', flexDirection: 'row', paddingTop: '10px'}}>
            <DatePicker
                selected={new Date(date)}
                onChange={(date) => handleSelectedDate(date)}
                maxDate={new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+29)}
                minDate={new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
                placeholderText="Select a date before 30 days in the future"
                customInput={<ExampleCustomInput />}

            />
            
        </div>
    </div>
  );
};

export default memo(HorizontalCalendar);
