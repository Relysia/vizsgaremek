import { useEffect, useState } from 'react';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import axios from 'axios';

function NewEvent({ setActive }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const dateformat = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(dateformat);
  const [endDate, setEndDate] = useState(dateformat);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');

  const postEvent = (title, location, description, startDate, startTime, endDate, endTime) => {
    const jwt = localStorage.getItem('jwt');

    axios
      .post(`${process.env.REACT_APP_BACKEND_HOST}/api/calendar/newevent`, { jwt, title, location, description, startDate, startTime, endDate, endTime })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className='newevent-container'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>New Event</h2>
      <div className='newevent-input-container'>
        <div className='top-input'>
          <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Event Title' required />
          <input type='text' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Event Location' required />
        </div>
        <input id='description' type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Write Your Event Description' required />
        <h3>Start Date</h3>
        <div className='date-input'>
          <input type='date' value={startDate} min={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder='StartDate' required />
          <input type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <h3>End Date</h3>
        <div className='date-input'>
          <input type='date' value={endDate} min={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder='EndDate' required />
          <input type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <button onClick={() => postEvent(title, location, description, startDate, startTime, endDate, endTime)}>POST IT!</button>
      </div>
    </div>
  );
}

export default NewEvent;
