import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function CreateTeam({ setActive }) {
  let history = useHistory();
  const [checked, setChecked] = useState(true);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(false);

  const createTeam = (title, publicValue) => {
    setProgress(true);
    const jwt = localStorage.getItem('jwt');

    axios
      .post(`${process.env.REACT_APP_BACKEND_HOST}/api/team/create`, { jwt, title, publicValue })
      .then((res) => {
        console.log(res.data);
        setActive(false);
        history.go(0);
      })
      .then((err) => console.log(err));
  };

  return (
    <div className='create-team'>
      <h2>Create Team</h2>
      <p>Team name</p>
      <input type='text' placeholder='Oceans 11' value={title} onChange={(e) => setTitle(e.target.value)} />
      <p>People can join your group</p>
      <input type='checkbox' name='public' value='public' checked={checked} onChange={() => setChecked(!checked)} />
      {!progress ? <button onClick={() => createTeam(title, checked)}>Create</button> : <p className='team-progress'>Creating your team</p>}
    </div>
  );
}

export default CreateTeam;
