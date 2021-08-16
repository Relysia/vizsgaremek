import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import Moment from 'react-moment';

function SumCalendar({ data, setActive }) {
  const upcommingEvents = data.events.filter((event) => new Date(event.start.dateTime) > new Date());

  const pastEvents = data.events.filter((event) => new Date(event.start.dateTime) < new Date()).reverse();

  return (
    <div className='summary-submenu'>
      <AiFillCloseCircle onClick={() => setActive(false)} />
      <h3>Calendar</h3>
      <h4 className='summary-calendar-title'>Upcomming Events</h4>
      {upcommingEvents.map((event, i) => (
        <div key={i} className='summary-events'>
          <h4>{event.summary}</h4>
          <div>
            <Moment format='YYYY.MM.DD'>{event.start.dateTime}</Moment>
            <Moment fromNow>{event.start.dateTime}</Moment>
            <a href={event.htmlLink} target='_blank' rel='noreferrer'>
              Go to Calendar
            </a>
          </div>
        </div>
      ))}
      <h4 className='summary-calendar-title'>Past Events</h4>
      {pastEvents.map((event, i) => (
        <div key={i} className='summary-events'>
          <h4>{event.summary}</h4>
          <div>
            <Moment format='YYYY.MM.DD'>{event.start.dateTime}</Moment>
            <Moment fromNow>{event.start.dateTime}</Moment>
            <a href={event.htmlLink} target='_blank' rel='noreferrer'>
              Go to Calendar
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SumCalendar;
