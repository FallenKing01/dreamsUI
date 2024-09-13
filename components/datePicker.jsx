import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/datePicker.css'; // Import custom styles if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCalendar } from '@fortawesome/free-solid-svg-icons';
const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle the start date change
  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Optionally, you can clear end date if it's before the start date
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  // Handle the end date change
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div className="dateContainer">
      <h2 className="dateTitleComponent">Select date range</h2>
      <div className="datePickersContainer">
        <div className="datePickerWrapper"><label htmlFor="start-date">Start Date <FontAwesomeIcon icon={faCalendar} size="sm" /></label>       
     <DatePicker
            id="start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select start date"
            className="custom-datepicker"
          />
        </div>
        <div className="datePickerWrapper">
        <label htmlFor="start-date">End Date <FontAwesomeIcon icon={faCalendar} size="sm" /></label> 
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate} // Prevent selecting an end date before the start date
            dateFormat="MMMM d, yyyy"
            placeholderText="Select end date"
            className="custom-datepicker"
          />
        </div>
      </div>
      <button>Search</button>
    </div>
  );
};

export default DateRangePicker;
