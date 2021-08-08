import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import { SiGooglecalendar } from 'react-icons/si';
import axios from 'axios';

function UpcommingEvent({ setActive, leader }) {
  const user = useContext(UserContext);
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);

  const getUpcomming = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/getupcomming`;

    const auth = { Authorization: jwt };

    axios({ method: 'get', url, headers: auth })
      .then((res) => {
        setData(res.data.items);
      })
      .catch((err) => console.log(err));
  };

  const calendarRole = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/calendarrole`;

    const auth = { Authorization: jwt };

    const data = {
      email: user.email,
    };

    axios({ method: 'post', url, data, headers: auth })
      .then((res) => {
        setRole(res.data[0]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    calendarRole();
    getUpcomming();
  }, []);

  return (
    <div className='upcomming-event'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>Upcomming</h2>
      {role && !role.share && <p className='upcomming-noshare'>Team calendar is not shared with you yet</p>}
      {data && data.length > 0
        ? data.map((event, i) => (
            <div key={i} className='event-container'>
              <h3>{event.summary}</h3>
              <div className='event-time'>
                <div className='event-start'>
                  <p>{event.start.dateTime.slice(11, 16)}</p>
                  <p>{event.start.dateTime.slice(0, 10)}</p>
                </div>
                <div className='event-duration'>
                  <p>Duration:</p>
                  <p>{parseInt(event.end.dateTime.slice(11, 16)) - parseInt(event.start.dateTime.slice(11, 16))} Hour</p>
                </div>
              </div>
              {role && role.join ? (
                <a href={event.htmlLink} target='_blank' rel='noreferrer'>
                  Show in Google Calendar
                </a>
              ) : (
                leader && (
                  <a href={event.htmlLink} target='_blank' rel='noreferrer'>
                    Show in Google Calendar
                  </a>
                )
              )}
            </div>
          ))
        : data && data.length < 1 && <h3>No team events yet</h3>}
      {role && !role.join && role.share && <p className='upcomming-noshare'>You can add these events to your google calendar in the crew menu</p>}
    </div>
  );
}

export default UpcommingEvent;
