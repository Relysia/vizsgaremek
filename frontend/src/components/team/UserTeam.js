import { useEffect, useState } from 'react';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import axios from 'axios';

function UserTeam({ setActive }) {
  const [data, setData] = useState(null);

  const getUserTeam = () => {
    const jwt = localStorage.getItem('jwt');

    axios
      .post(`${process.env.REACT_APP_BACKEND_HOST}/api/team/userteam`, { jwt })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserTeam();
  }, []);

  return (
    <div className='user-team'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      {data && (
        <>
          <h2>{data.title}</h2>
          <div className='teamleader-container'>
            <img src={data.leader.picture} alt='' />
            <h3>{data.leader.name}</h3>
            <p>{data.leader.role}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default UserTeam;
