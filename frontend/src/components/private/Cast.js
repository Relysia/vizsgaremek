import { useState, useEffect } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { AiFillPlusSquare } from 'react-icons/ai';
import { AiFillPlusCircle } from 'react-icons/ai';
import CastTable from './CastTable';
import axios from 'axios';

function Cast({ setActive }) {
  const [budgetInput, setBudgetInput] = useState(false);
  const [data, setData] = useState(null);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  const fetchData = () => {
    const jwt = localStorage.getItem('jwt');

    axios
      .get(`http://localhost:8080/api/budget?jwt=${jwt}`)
      .then((res) => {
        setData(res.data.cast);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCast = () => {
    const jwt = localStorage.getItem('jwt');
    const numberCost = parseInt(cost);
    const type = 'cast';

    axios
      .post(`http://localhost:8080/api/budget/`, { jwt, type, first: role, second: name, third: numberCost })
      .then((res) => {
        fetchData();
        setBudgetInput(false);
        setRole('');
        setName('');
        setCost('');
      })
      .catch((err) => console.log(err));
  };

  const updateCast = (objectId, role, name, cost) => {
    const jwt = localStorage.getItem('jwt');
    const type = 'cast';

    axios
      .put(`http://localhost:8080/api/budget?jwt=${jwt}&type=${type}&objectId=${objectId}&first=${role}&second=${name}&third=${cost}`)
      .then((res) => {
        fetchData();
      })
      .catch((err) => console.log(err));
  };

  const deleteCast = (objectId, castName) => {
    const jwt = localStorage.getItem('jwt');
    const type = 'cast';

    axios
      .delete(`http://localhost:8080/api/budget?jwt=${jwt}&type=${type}&objectId=${objectId}&name=${castName}`)
      .then((res) => {
        fetchData();
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='budget-submenu'>
      <AiFillCloseCircle className='close-button' onClick={() => setActive(false)} />
      <h2>Cast</h2>
      {data && data.length > 0 && (
        <div className='table-container'>
          {data.map((data, i) => (
            <CastTable key={i} data={data} updateCast={updateCast} deleteCast={deleteCast} />
          ))}
          <p className='total-cost'>Total: {data.map((data) => data.cast_cost).reduce((a, b) => a + b, 0)} HUF</p>
        </div>
      )}
      <AiFillPlusSquare className='add-button' onClick={() => setBudgetInput(!budgetInput)} />
      {budgetInput && (
        <div className='budget-input-container'>
          <input type='text' placeholder='Cinematographer' value={role} onChange={(e) => setRole(e.target.value)} />
          <input type='text' placeholder='Emmanuel Lubezki' value={name} onChange={(e) => setName(e.target.value)} />
          <input type='text' placeholder='200000' pattern='[0-9]+' value={cost} onChange={(e) => setCost(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} />
          <p>HUF</p>
          <div onClick={addCast}>
            <AiFillPlusCircle />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cast;
