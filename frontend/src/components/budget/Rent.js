import { useState, useEffect, useRef } from 'react';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import { AiFillPlusSquare } from 'react-icons/ai';
import { AiFillPlusCircle } from 'react-icons/ai';
import RentTable from './RentTable';
import GetBudget from '../../api/GetBudget';
import AddBudget from '../../api/AddBudget';
import UpdateBudget from '../../api/UpdateBudget';
import DeleteBudget from '../../api/DeleteBudget';

function Rent({ setActive, leader }) {
  const [budgetInput, setBudgetInput] = useState(false);
  const [data, setData] = useState(null);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const selectInput = useRef(null);

  // Type of budget
  const budgetType = 'rent';

  // Format Total Price
  const formatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
  });
  const total = data && data.map((data) => data.rent_cost).reduce((a, b) => a + b, 0);
  const formatTotal = formatter.format(total);

  // Get input field in focus
  const jumpToInput = (e) => {
    e && e.preventDefault();
    if (!budgetInput) {
      setTimeout(() => {
        selectInput.current.focus();
      }, 100);
    }
  };

  useEffect(() => {
    GetBudget(setData, budgetType);
  }, []);

  const addCast = () => {
    const numberCost = parseInt(cost);
    AddBudget(budgetType, GetBudget, setData, setBudgetInput, setType, setName, setCost, type, name, numberCost);
  };

  const updateCast = (objectId, type, name, cost) => {
    const numberCost = parseInt(cost);
    UpdateBudget(budgetType, GetBudget, setData, objectId, type, name, numberCost);
  };

  const deleteCast = (objectId) => {
    DeleteBudget(budgetType, GetBudget, setData, objectId);
  };

  return (
    <div className='budget-submenu'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>Rent</h2>
      {data && data.length > 0 ? (
        <div className='table-container'>
          <div className='table-title'>
            <p>Type</p>
            <p>Name</p>
            <p>Cost (Ft)</p>
          </div>
          {data.map((data) => (
            <RentTable leader={leader} key={data._id} data={data} updateCast={updateCast} deleteCast={deleteCast} />
          ))}
          <p className='total-cost'>Total: {formatTotal}</p>
        </div>
      ) : (
        <h3>No record for this category yet</h3>
      )}
      {leader && (
        <div onClick={(e) => jumpToInput(e)} className='add-button-link'>
          <AiFillPlusSquare
            className='add-button'
            onClick={() => {
              setBudgetInput(!budgetInput);
              setType('');
              setName('');
              setCost('');
            }}
          />
        </div>
      )}
      {budgetInput && leader && (
        <div className='budget-input-container'>
          <div className='budget-title'>
            <p>Type</p>
            <p>Name</p>
            <p>Cost (Ft)</p>
          </div>
          <div className='budget-input'>
            <input type='text' placeholder='House' value={type} onChange={(e) => setType(e.target.value)} ref={selectInput} />
            <input type='text' placeholder='Timberline Lodge' value={name} onChange={(e) => setName(e.target.value)} />
            <input type='text' placeholder='3000000' value={cost} onChange={(e) => setCost(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} />
            <AiFillPlusCircle onClick={addCast} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Rent;
