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
            <h3>Leader</h3>
            <img src={data.leader.picture} alt='Leader' />
            <div>
              <h4>{data.leader.name}</h4>
              <p>{data.leader.role}</p>
            </div>
          </div>
          {data.members.length > 0 ? (
            <div className='teammember-container'>
              <h3>Members</h3>
              <div className='teammember-members'>
                {data.members.map((member) => (
                  <div className='teammember'>
                    <img src={member.picture} alt='Member' />
                    <div>
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !data.public ? (
            <div className='teammember-container'>
              <h3>Your team is not public</h3>
            </div>
          ) : (
            <div className='teammember-container'>
              <h3>No one joined your group yet</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserTeam;
