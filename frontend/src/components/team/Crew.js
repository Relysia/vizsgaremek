import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import axios from 'axios';
import { GiTeamIdea } from 'react-icons/gi';
import { RiGroup2Fill } from 'react-icons/ri';
import CreateTeam from './CreateTeam';
import UserTeam from './UserTeam';

function Crew(props) {
  const menu = useContext(MenuContext);
  const [bgVideo, setBgVideo] = useState(null);
  const [active, setActive] = useState(false);

  const [data, setData] = useState(null);

  const getUser = () => {
    const jwt = localStorage.getItem('jwt');

    axios
      .post(`${process.env.REACT_APP_BACKEND_HOST}/api/team/getroles`, { jwt })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    PexelsVideoApi('7551531', setBgVideo);
    getUser();
  }, []);

  return (
    <div>
      <VideoBackground video={bgVideo} />
      {!menu && (
        <div className='crew-container'>
          {!active && (
            <>
              <h2>Crew</h2>
              <div className='crew-options'>
                {data && data.leader && data.calendar_id === '' ? (
                  <div onClick={() => setActive('create')}>
                    <GiTeamIdea />
                    <h3>Create Team</h3>
                  </div>
                ) : (
                  data &&
                  data.leader &&
                  data.calendar_id !== '' && (
                    <div onClick={() => setActive('team')}>
                      <RiGroup2Fill />
                      <h3>Your Team</h3>
                    </div>
                  )
                )}
              </div>
            </>
          )}
          {active === 'create' && <CreateTeam setActive={setActive} />}
          {active === 'team' && <UserTeam setActive={setActive} />}
        </div>
      )}
    </div>
  );
}

export default Crew;
