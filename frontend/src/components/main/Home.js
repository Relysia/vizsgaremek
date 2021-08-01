import { useEffect, useState, useContext } from 'react';
import { UserContext, MenuContext } from '../../App';
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
      <VideoBackground video={bgVideo} />
      {user && !menu && (
        <>
          <div className='home-container'>
            <h2>Welcome!</h2>
            <p>You can start working on your project by clicking on the menu icon</p>
          </div>
        </>
      )}
    </section>
  );
}

export default Home;
