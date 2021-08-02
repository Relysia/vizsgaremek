import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import { FaHome } from 'react-icons/fa';

function Alert({ alert, message }) {
  const [bgVideo, setBgVideo] = useState(null);

  useEffect(() => {
    PexelsVideoApi('3037316', setBgVideo);
  }, []);

  return (
    <div className={alert ? 'alert-container' : 'loading-container'}>
      <div className='alert-top-bar'></div>
      {message ? (
        <>
          <VideoBackground video={bgVideo} />
          <h2>- {message}</h2>
          <Link to='/'>
            <FaHome />
          </Link>
        </>
      ) : (
        <>
          <h2>- Authentication in progress</h2>
        </>
      )}
    </div>
  );
}

export default Alert;
