import { useEffect, useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import { SiGooglecalendar } from 'react-icons/si';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';

function Landing(props) {
  const [bgVideo, setBgVideo] = useState(null);

  useEffect(() => {
    PexelsVideoApi('5596906', setBgVideo);
  }, []);

  return (
    <section>
      <VideoBackground video={bgVideo} />
      <div className='intro-container'>
        <div>
          <FaUserTie />
          <h2>Unite</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis impedit deleniti autem molestiae culpa a illum officia? Animi id consequatur possimus recusandae, sapiente qui quidem, delectus vero, earum</p>
        </div>
        <div>
          <GiCash />
          <h2>Calculate</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis impedit deleniti autem molestiae culpa a illum officia? Animi id consequatur possimus recusandae, sapiente qui quidem, delectus vero, earum</p>
        </div>
        <div>
          <SiGooglecalendar />
          <h2>Schedule</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis impedit deleniti autem molestiae culpa a illum officia? Animi id consequatur possimus recusandae, sapiente qui quidem, delectus vero, earum</p>
        </div>
      </div>
    </section>
  );
}

export default Landing;
