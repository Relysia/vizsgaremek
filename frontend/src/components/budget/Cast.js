import { useState, useEffect } from 'react';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import { AiFillPlusSquare } from 'react-icons/ai';
import { AiFillPlusCircle } from 'react-icons/ai';
import CastTable from './CastTable';
import GetBudget from '../../api/GetBudget';
import AddBudget from '../../api/AddBudget';
import UpdateBudget from '../../api/UpdateBudget';
import DeleteBudget from '../../api/DeleteBudget';

function Cast({ setActive }) {
  const [budgetInput, setBudgetInput] = useState(false);
  const [data, setData] = useState(null);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');

  // Type of budget
  const budgetType = 'cast';

  // Format Total Price
  const formatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
  });
  const total = data && data.map((data) => data.cast_cost).reduce((a, b) => a + b, 0);
  const formatTotal = formatter.format(total);

  useEffect(() => {
    GetBudget(setData, budgetType);
  }, []);

  const addCast = () => {
    const numberCost = parseInt(cost);
    AddBudget(budgetType, GetBudget, setData, setBudgetInput, setRole, setName, setCost, role, name, numberCost);
  };

  const updateCast = (objectId, role, name, cost) => {
    const numberCost = parseInt(cost);
    UpdateBudget(budgetType, GetBudget, setData, objectId, role, name, numberCost);
  };

  const deleteCast = (objectId) => {
    DeleteBudget(budgetType, GetBudget, setData, objectId);
  };

  return (
    <div className='budget-submenu'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>Cast</h2>
      {data && data.length > 0 && (
        <div className='table-container'>
          <div className='table-title'>
            <p>Role</p>
            <p>Name</p>
            <p>Cost (Ft)</p>
          </div>
          {data.map((data) => (
            <CastTable key={data._id} data={data} updateCast={updateCast} deleteCast={deleteCast} />
          ))}
          <p className='total-cost'>Total: {formatTotal}</p>
        </div>
      )}
      <AiFillPlusSquare
        className='add-button'
        onClick={() => {
          setBudgetInput(!budgetInput);
          setRole('');
          setName('');
          setCost('');
        }}
      />
      {budgetInput && (
        <div className='budget-input-container'>
          <div className='budget-title'>
            <p>Role</p>
            <p>Name</p>
            <p>Cost (Ft)</p>
          </div>
          <div className='budget-input'>
            <input type='text' placeholder='Actor' value={role} onChange={(e) => setRole(e.target.value)} />
            <input type='text' placeholder='Tom Hanks' value={name} onChange={(e) => setName(e.target.value)} />
            <input type='text' placeholder='2000000' value={cost} onChange={(e) => setCost(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} />
            <AiFillPlusCircle onClick={addCast} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cast;
