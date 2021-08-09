import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import JoinTeamCard from './JoinTeamCard';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';

function JoinTeam({ setActive }) {
  let history = useHistory();
  const [data, setData] = useState(null);

  const getTeams = () => {
    const jwt = localStorage.getItem('jwt');

    const options = {
      headers: {
        Authorization: jwt,
      },
    };

    axios
      .get(`${process.env.REACT_APP_BACKEND_HOST}/api/team/getteam`, options)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTeams();
  }, []);

  const joinTeam = (calendar_id, role) => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/team/jointeam`;

    const auth = { Authorization: jwt };

    const data = {
      calendar_id,
      role,
    };

    axios({ method: 'post', url, data, headers: auth })
      .then((res) => {
        setActive(false);
        history.go(0);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='join-team'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>Join Team</h2>
      {data && data.length < 1 && <p className='noteam-present'>No team available to join</p>}
      {data && data.map((team, i) => <JoinTeamCard key={i} team={team} joinTeam={joinTeam} />)}
    </div>
  );
}

export default JoinTeam;
