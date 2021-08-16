import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

function SumCrew({ data, setActive }) {
  return (
    <div className='summary-submenu'>
      <AiFillCloseCircle onClick={() => setActive(false)} />
      <h3>Crew</h3>
      <h4>Leader</h4>
      <div className='summary-crew'>
        <img src={data.leader.picture} alt='Leader' />
        <p>{data.leader.name} |</p>
        <p>{data.leader.role}</p>
      </div>
      <h4>Members</h4>
      {data.members.map((member, i) => (
        <div key={i} className='summary-crew'>
          <img src={member.picture} alt='Leader' />
          <p>{member.name} |</p>
          <p>{member.role}</p>
        </div>
      ))}
    </div>
  );
}

export default SumCrew;
