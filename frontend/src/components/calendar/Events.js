import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import axios from 'axios';
import { FaCalendarPlus } from 'react-icons/fa';
import NewEvent from './NewEvent';

function Events(props) {
  const menu = useContext(MenuContext);
  const [bgVideo, setBgVideo] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    PexelsVideoApi('7551531', setBgVideo);
  }, []);

  return (
    <div>
      <VideoBackground video={bgVideo} />
      {!menu && (
        <div className='submenu-container'>
          {!active && (
            <>
              <h2 className='submenu-title'>Events</h2>
              <div className='submenu-options'>
                <div onClick={() => setActive('event')}>
                  <FaCalendarPlus />
                  <h3>New Event</h3>
                </div>
              </div>
            </>
          )}
          {active === 'event' && <NewEvent setActive={setActive} />}
        </div>
      )}
    </div>
  );
}

export default Events;
