import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import axios from 'axios';
import { FaCalendarPlus } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import Alert from '../alert/Alert';
import NewEvent from './NewEvent';
import UpcommingEvent from './UpcommingEvent';

function Events(props) {
  const menu = useContext(MenuContext);
  const [message, setMessage] = useState(null);
  const [bgVideo, setBgVideo] = useState(null);
  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);

  const getRoles = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/getroles`;

    const auth = { Authorization: jwt };

    axios({ method: 'post', url, headers: auth })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => setMessage(err.response.data));
  };

  const calendarAuth = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/calendarauth`;

    const auth = { Authorization: jwt };

    axios({ method: 'post', url, headers: auth })
      .then((res) => {
        return;
      })
      .catch((err) => setMessage(err.response.data));
  };

  useEffect(() => {
    PexelsVideoApi('5363068', setBgVideo);
    calendarAuth();
    getRoles();
  }, []);

  return (
    <div>
      {!message ? (
        <>
          <VideoBackground video={bgVideo} />
          {!menu && (
            <div className='submenu-container'>
              {!active && (
                <>
                  <h2 className='submenu-title'>Events</h2>
                  <div className='submenu-options'>
                    {data && data.leader && data.calendar_id !== '' ? (
                      <>
                        <div onClick={() => setActive('event')}>
                          <FaCalendarPlus />
                          <h3>New Event</h3>
                        </div>
                        <div onClick={() => setActive('upcomming')}>
                          <FaCalendarAlt />
                          <h3>Upcomming</h3>
                        </div>
                      </>
                    ) : (
                      data && data.leader && data.calendar_id === '' && <p className='noteam-message'>You need to create a team first</p>
                    )}
                    {data && !data.leader && data.calendar_id !== '' ? (
                      <div onClick={() => setActive('upcomming')}>
                        <FaCalendarAlt />
                        <h3>Upcomming</h3>
                      </div>
                    ) : (
                      data && !data.leader && data.calendar_id === '' && <p className='noteam-message'>You need to join a team first!</p>
                    )}
                  </div>
                </>
              )}
              {active === 'event' && <NewEvent setActive={setActive} />}
              {active === 'upcomming' && <UpcommingEvent setActive={setActive} leader={data.leader} />}
            </div>
          )}
        </>
      ) : (
        <Alert alert={true} message={message} />
      )}
    </div>
  );
}

export default Events;
