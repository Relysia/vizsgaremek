import { useState } from 'react';

function JoinTeamCard({ team, joinTeam }) {
  const [role, setRole] = useState('');
  const [progress, setProgress] = useState(false);

  return (
    <div>
      {team.public ? (
        <>
          <h3>{team.title}</h3>
          <img src={team.picture} alt='Team Leader' />
          <p>Leader</p>
          <h3>{team.name}</h3>
          <p>Your Role</p>
          <input type='text' placeholder='Actor' value={role} onChange={(e) => setRole(e.target.value)} />
          {!progress ? (
            <button
              onClick={() => {
                setProgress(true);
                joinTeam(team.calendar_id, role);
              }}
              disabled={role === '' ? true : false}>
              Join
            </button>
          ) : (
            <p className='join-progress'>Joining in progress</p>
          )}
        </>
      ) : (
        <p className='noteam-present'>No team available to join</p>
      )}
    </div>
  );
}

export default JoinTeamCard;
