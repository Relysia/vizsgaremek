import { useEffect, useState } from 'react';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import Moment from 'react-moment';
import axios from 'axios';

function UpcommingEvent({ setActive, leader }) {
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);

  const getUpcomming = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/getupcomming`;

    const auth = { Authorization: jwt };

    axios({ method: 'get', url, headers: auth })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const calendarRole = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/calendarrole`;

    const auth = { Authorization: jwt };

    axios({ method: 'post', url, headers: auth })
      .then((res) => {
        setRole(res.data[0]);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    calendarRole();
    getUpcomming();
  }, []);

  const upcommingEvents = data && !data.message?.includes('failed') && data.filter((event) => new Date(event.start.dateTime) > new Date());
  const pastEvents = data && !data.message?.includes('failed') && data.filter((event) => new Date(event.start.dateTime) < new Date()).reverse();

  return (
    <div className='upcomming-event'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      {role && !role.join && role.share && <p className='upcomming-noshare'>You can add these events to your google calendar in the crew menu</p>}
      <h2>Upcomming</h2>
      {role && !role.share && <p className='upcomming-noshare'>Team calendar is not shared with you yet</p>}
      <div className='event-style'>
        {data && data.length > 0
          ? upcommingEvents.map((event, i) => (
              <div key={i} className='event-container'>
                <div className='event-time'>
                  <Moment format='ddd'>{event.start.dateTime}</Moment>
                  <Moment format='D'>{event.start.dateTime}</Moment>
                  <Moment format='HH:mm'>{event.start.dateTime}</Moment>
                </div>
                <div className='event-details'>
                  <h3>{event.summary}</h3>
                  <Moment fromNow>{event.start.dateTime}</Moment>
                  <div className='event-duration'>
                    <p>Duration:</p>
                    <Moment duration={event.start.dateTime} date={event.end.dateTime} format='H' />
                    <p>Hour(s)</p>
                  </div>
                  {role && role.join ? (
                    <a href={event.htmlLink} target='_blank' rel='noreferrer'>
                      Show in Calendar
                    </a>
                  ) : (
                    leader && (
                      <a href={event.htmlLink} target='_blank' rel='noreferrer'>
                        Show in Calendar
                      </a>
                    )
                  )}
                </div>
              </div>
            ))
          : data && data.length < 1 && <h3>No upcomming event</h3>}
      </div>
      <h2>Past </h2>
      {role && !role.share && <p className='upcomming-noshare'>Team calendar is not shared with you yet</p>}
      <div className='event-style'>
        {data && data.length > 0
          ? pastEvents.map((event, i) => (
              <div key={i} className='event-container'>
                <div className='event-time'>
                  <Moment format='ddd'>{event.start.dateTime}</Moment>
                  <Moment format='D'>{event.start.dateTime}</Moment>
                  <Moment format='HH:mm'>{event.start.dateTime}</Moment>
                </div>
                <div className='event-details'>
                  <h3>{event.summary}</h3>
                  <Moment fromNow>{event.start.dateTime}</Moment>
                  <div className='event-duration'>
                    <p>Duration:</p>
                    <Moment duration={event.start.dateTime} date={event.end.dateTime} format='H' />
                    <p>Hour(s)</p>
                  </div>
                  {role && role.join ? (
                    <a href={event.htmlLink} target='_blank' rel='noreferrer'>
                      Show in Calendar
                    </a>
                  ) : (
                    leader && (
                      <a href={event.htmlLink} target='_blank' rel='noreferrer'>
                        Show in Calendar
                      </a>
                    )
                  )}
                </div>
              </div>
            ))
          : data && data.length < 1 && <h3>No past events</h3>}
      </div>
    </div>
  );
}

export default UpcommingEvent;
