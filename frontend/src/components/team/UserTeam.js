import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import axios from 'axios';

function UserTeam({ setActive, role }) {
  const user = useContext(UserContext);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);

  const getUserTeam = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/team/userteam`;

    const auth = { Authorization: jwt };

    axios({ method: 'post', url, headers: auth })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserTeam();
  }, [message]);

  const postAclRule = (email) => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/sharecalendar`;

    const auth = { Authorization: jwt };

    const data = {
      email,
    };

    axios({ method: 'post', url, data, headers: auth })
      .then((res) => {
        setMessage('Successfully shared');
        setTimeout(() => {
          setMessage(null);
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const addCalendar = (email) => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/calendar/addcalendar`;

    const auth = { Authorization: jwt };

    const data = {
      email,
    };

    axios({ method: 'post', url, data, headers: auth })
      .then((res) => {
        setMessage('Successfully shared');
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

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
              <h4 style={{ color: role.leader ? '#ffbb22' : '#ffffff' }}>{data.leader.name}</h4>
              <p>{data.leader.role}</p>
            </div>
          </div>
          {data.members.length > 0 ? (
            <div className='teammember-container'>
              <h3>Members</h3>
              <div className='teammember-members'>
                {data.members.map((member) => (
                  <div className='teammember' key={member.id}>
                    <img src={member.picture} alt='Member' />
                    <div>
                      <h4 style={{ color: member.email === user.email ? '#ffba00' : '#ffffff' }}>{member.name}</h4>
                      <p>{member.role}</p>
                      {role.leader && !member.share ? <button onClick={() => postAclRule(member.email)}>Share Calendar</button> : role.leader && member.share && <p>Calendar shared</p>}
                      {member.email === user.email && !role.leader && !member.share ? <p>Calendar not shared</p> : member.email === user.email && !role.leader && !member.join ? <button onClick={() => addCalendar(member.email)}>Add to Google Calendar</button> : member.email === user.email && !role.leader && member.join && <p>Calendar Added</p>}
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
              <h3>No one joined your team yet</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserTeam;
