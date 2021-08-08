import { useEffect, useState, useContext } from 'react';
import { UserContext, MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import axios from 'axios';
import Alert from '../alert/Alert';

function Home(props) {
  const user = useContext(UserContext);
  const menu = useContext(MenuContext);
  const [bgVideo, setBgVideo] = useState(null);
  const [message, setMessage] = useState(null);
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

  useEffect(() => {
    PexelsVideoApi('5596906', setBgVideo);
    getRoles();
  }, []);

  return (
    <section>
      <>
        <VideoBackground video={bgVideo} />
        {user && !menu && (
          <>
            <div className='home-container'>
              <h2>Welcome!</h2>
              <p>You can start working on your project by clicking on the menu icon</p>
            </div>
          </>
        )}
      </>
      )
    </section>
  );
}

export default Home;
