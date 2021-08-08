import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import axios from 'axios';

function CreateTeam({ setActive }) {
  let history = useHistory();
  const [joinChecked, setJoinChecked] = useState(true);
  const [budgetChecked, setBudgetChecked] = useState(true);
  const [title, setTitle] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [progress, setProgress] = useState(false);

  const createTeam = (title, joinPublic, budgetPublic, teamRole) => {
    setProgress(true);
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/team/create`;

    const auth = { Authorization: jwt };

    const data = {
      title,
      joinPublic,
      budgetPublic,
      teamRole,
    };

    axios({ method: 'post', url, data, headers: auth })
      .then((res) => {
        setActive(false);
        history.go(0);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='create-team'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>Create Team</h2>
      <p>Team name</p>
      <input type='text' placeholder='Oceans 11' value={title} onChange={(e) => setTitle(e.target.value)} />
      <p>Your Role</p>
      <input type='text' placeholder='Director' value={teamRole} onChange={(e) => setTeamRole(e.target.value)} />
      <div>
        <p>People can join your group</p>
        <input type='checkbox' name='joinPublic' value='joinPublic' checked={joinChecked} onChange={() => setJoinChecked(!joinChecked)} />
      </div>
      <div>
        <p>People can see your budget</p>
        <input type='checkbox' name='budgetPublic' value='budgetPublic' checked={budgetChecked} onChange={() => setBudgetChecked(!budgetChecked)} />
      </div>
      {!progress ? <button onClick={() => createTeam(title, joinChecked, budgetChecked, teamRole)}>Create</button> : <p className='team-progress'>Creating your team</p>}
    </div>
  );
}

export default CreateTeam;
