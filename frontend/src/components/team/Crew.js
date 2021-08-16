import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import axios from 'axios';
import { GiTeamIdea } from 'react-icons/gi';
import { RiGroup2Fill } from 'react-icons/ri';
import { TiUserAdd } from 'react-icons/ti';
import Alert from '../alert/Alert';
import CreateTeam from './CreateTeam';
import UserTeam from './UserTeam';
import JoinTeam from './JoinTeam';

function Crew(props) {
  const menu = useContext(MenuContext);
  const [bgVideo, setBgVideo] = useState(null);
  const [message, setMessage] = useState(null);
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

  useEffect(() => {
    PexelsVideoApi('7668955', setBgVideo);
    getRoles();
  }, []);

  return (
    <section>
      {!message ? (
        <>
          <VideoBackground video={bgVideo} />
          {!menu && (
            <div className='submenu-container'>
              {!active && (
                <>
                  <h2 className='submenu-title'>Crew</h2>
                  <div className='submenu-options'>
                    {data && data.leader && data.calendar_id === '' ? (
                      <div onClick={() => setActive('create')}>
                        <GiTeamIdea />
                        <h3>Create Team</h3>
                      </div>
                    ) : data && !data.leader && data.calendar_id === '' ? (
                      <div onClick={() => setActive('join')}>
                        <TiUserAdd />
                        <h3>Join Team</h3>
                      </div>
                    ) : (
                      data &&
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
              {active === 'team' && <UserTeam setActive={setActive} role={data} />}
              {active === 'join' && <JoinTeam setActive={setActive} />}
            </div>
          )}
        </>
      ) : (
        <Alert alert={true} message={message} />
      )}
    </section>
  );
}

export default Crew;
