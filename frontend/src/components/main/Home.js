import { useEffect, useState, useContext } from 'react';
import { UserContext, MenuContext } from '../../App';
import { RiGroupFill } from 'react-icons/ri';
import { GiCash } from 'react-icons/gi';
import { SiGooglecalendar } from 'react-icons/si';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';

function Home(props) {
  const user = useContext(UserContext);
  const menu = useContext(MenuContext);
  const [bgVideo, setBgVideo] = useState(null);

  useEffect(() => {
    PexelsVideoApi('5596906', setBgVideo);
  }, []);

  return (
    <section>
      <>
        <VideoBackground video={bgVideo} />
        {user && !menu ? (
          <>
            <div className='home-container'>
              <h2>Welcome!</h2>
              <p>You can start working on your project by clicking on the menu icon</p>
            </div>
          </>
        ) : (
          !user &&
          !menu && (
            <div className='intro-container'>
              <div>
                <RiGroupFill />
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
          )
        )}
      </>
      )
    </section>
  );
}

export default Home;
