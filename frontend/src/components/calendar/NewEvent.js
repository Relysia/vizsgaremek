import { useState } from 'react';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import axios from 'axios';

function NewEvent({ setActive }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const dateformat = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(dateformat);
  const [endDate, setEndDate] = useState(dateformat);
  const [startTime, setStartTime] = useState('13:00');
  const [endTime, setEndTime] = useState('14:00');
  const [data, setData] = useState(null);
  const [colorSelect, setColorSelect] = useState('a4bdfc');
  const [colorId, setColorId] = useState('1');

  const postEvent = (title, location, description, startDate, startTime, endDate, endTime) => {
    if (title === '' || location === '' || description === '') {
      setData('Please fill out all required fields!');
      setTimeout(() => {
        setData(null);
      }, 3000);
    } else {
      setData('Sending to Google Calendar...');

      const jwt = localStorage.getItem('jwt');
      const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/newevent`;
      const auth = { Authorization: jwt };

      const data = {
        title,
        location,
        description,
        colorId,
        startDate,
        startTime,
        endDate,
        endTime,
      };

      axios({ method: 'post', url, data, headers: auth })
        .then((res) => {
          setData(res.data);
          setTitle('');
          setLocation('');
          setDescription('');
          setStartDate(dateformat);
          setEndDate(dateformat);
          setStartTime('13:00');
          setEndTime('14:00');
          setTimeout(() => {
            setData(null);
          }, 4000);
        })
        .catch((err) => {
          setData(err.response.message);
          setTimeout(() => {
            setData(null);
          }, 4000);
        });
    }
  };

  return (
    <div className='newevent-container'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>New Event</h2>
      <div className='newevent-input-container'>
        <h3>Title</h3>
        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='First Shooting' required />
        <h3>Location</h3>
        <input type='text' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Budapest, Arany János street 1.' required />
        <h3>Description</h3>
        <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='First meeting with the crew' required />
        <h3>Event Color</h3>
        <select
          style={{ background: `#${colorSelect}` }}
          onChange={(e) => {
            setColorSelect(e.target.value);
          }}>
          <option value='a4bdfc' id='1' onClick={(e) => setColorId(e.target.id)}>
            Levander
          </option>
          <option value='7ae7bf' id='2' onClick={(e) => setColorId(e.target.id)}>
            Sage
          </option>
          <option value='dbadff' id='3' onClick={(e) => setColorId(e.target.id)}>
            Grape
          </option>
          <option value='ff887c' id='4' onClick={(e) => setColorId(e.target.id)}>
            Flamingo
          </option>
          <option value='fbd75b' id='5' onClick={(e) => setColorId(e.target.id)}>
            Banana
          </option>
          <option value='ffb878' id='6' onClick={(e) => setColorId(e.target.id)}>
            Tangrine
          </option>
          <option value='46d6db' id='7' onClick={(e) => setColorId(e.target.id)}>
            Peacock
          </option>
          <option value='e1e1e1' id='8' onClick={(e) => setColorId(e.target.id)}>
            Graphite
          </option>
          <option value='5484ed' id='9' onClick={(e) => setColorId(e.target.id)}>
            Blueberry
          </option>
          <option value='51b749' id='10' onClick={(e) => setColorId(e.target.id)}>
            Basil
          </option>
          <option value='dc2127' id='11' onClick={(e) => setColorId(e.target.id)}>
            Tomato
          </option>
        </select>
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
        {!data ? <button onClick={() => postEvent(title, location, description, startDate, startTime, endDate, endTime)}>POST IT!</button> : <p>{data}</p>}
      </div>
    </div>
  );
}

export default NewEvent;
