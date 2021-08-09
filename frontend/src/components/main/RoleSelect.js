import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import { FaChessKing } from 'react-icons/fa';
import { FaChessPawn } from 'react-icons/fa';
import axios from 'axios';

function RoleSelect(props) {
  let history = useHistory();
  const user = useContext(UserContext);
  const [bgVideo, setBgVideo] = useState(null);

  useEffect(() => {
    PexelsVideoApi('7688810', setBgVideo);
  }, []);

  const selectRole = (role) => {
    const jwtToken = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/role`;

    const auth = { Authorization: jwtToken };

    const data = {
      role,
    };

    axios({ method: 'post', url, data, headers: auth })
      .then((res) => {
        localStorage.setItem('jwt', res.data);
        history.push('/');
        history.go(0);
      })
      .catch((err) => console.log(err));
  };

  return (
    <section>
      <VideoBackground video={bgVideo} />
      {user && (
        <>
          <div className='role-container'>
            <h4 className='role-title'>Choose your role:</h4>
            <div className='role-select'>
              <div onClick={() => selectRole('leader')}>
                <FaChessKing />
                <p>Team Leader</p>
              </div>
              <div onClick={() => selectRole('member')}>
                <FaChessPawn />
                <p>Team Member</p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default RoleSelect;
