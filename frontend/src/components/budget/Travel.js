import { useState, useEffect } from 'react';
import { IoPlaySkipBackCircleSharp } from 'react-icons/io5';
import { AiFillPlusSquare } from 'react-icons/ai';
import { AiFillPlusCircle } from 'react-icons/ai';
import TravelTable from './TravelTable';
import GetBudget from '../../api/GetBudget';
import AddBudget from '../../api/AddBudget';
import UpdateBudget from '../../api/UpdateBudget';
import DeleteBudget from '../../api/DeleteBudget';

function Travel({ setActive, leader }) {
  const [budgetInput, setBudgetInput] = useState(false);
  const [data, setData] = useState(null);
  const [distance, setDistance] = useState('');
  const [total, setTotal] = useState(null);
  const [calculate, setCalculate] = useState(false);
  const [cons, setCons] = useState('');
  const [cost, setCost] = useState('');

  // Type of budget
  const budgetType = 'travel';

  // Format Total Price
  const formatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
  });
  const formatTotal = formatter.format(total);

  const totalPrice = () => {
    if (data !== null) {
      if (data.length > 0) {
        const details = data.map((data) => data);

        const reducer = (acc, curr) => acc + curr;

        let first = details.map((item) => item.travel_distance);
        let distance = first.reduce(reducer);

        let second = details.map((item) => item.travel_car_cons);
        let consumption = second.reduce(reducer);

        let third = details.map((item) => item.travel_litre_cost);
        let litrePrice = third.reduce(reducer);

        let final = Math.round((distance / 100) * (consumption / second.length) * (litrePrice / third.length));

        setTotal(final);
      }
    }
  };

  useEffect(() => {
    GetBudget(setData, budgetType);
  }, []);

  const addCast = () => {
    const numberDistance = parseInt(distance);
    const numberCons = parseInt(cons);
    const numberCost = parseInt(cost);
    AddBudget(budgetType, GetBudget, setData, setBudgetInput, setDistance, setCons, setCost, numberDistance, numberCons, numberCost);
  };

  const updateCast = (objectId, distance, cons, cost) => {
    const numberCost = parseInt(cost);
    UpdateBudget(budgetType, GetBudget, setData, objectId, distance, cons, numberCost);
  };

  const deleteCast = (objectId) => {
    DeleteBudget(budgetType, GetBudget, setData, objectId);
  };

  return (
    <div className='budget-submenu'>
      <IoPlaySkipBackCircleSharp className='back-button' onClick={() => setActive(false)} />
      <h2>Travel</h2>
      {data && data.length > 0 && (
        <div className='table-container'>
          <div className='table-title'>
            <p>Distance (Km)</p>
            <p>Consumption (L)</p>
            <p>1 Litre Cost (Ft)</p>
          </div>
          {data.map((data) => (
            <TravelTable leader={leader} key={data._id} data={data} updateCast={updateCast} deleteCast={deleteCast} setCalculate={setCalculate} />
          ))}
          {calculate ? (
            <p className='total-cost'>Total: {formatTotal}</p>
          ) : (
            <section className='calculate'>
              <p
                onClick={() => {
                  setCalculate(true);
                  totalPrice();
                }}>
                Calculate
              </p>
            </section>
          )}
        </div>
      )}
      {leader && (
        <AiFillPlusSquare
          className='add-button'
          onClick={() => {
            setBudgetInput(!budgetInput);
            setDistance('');
            setCons('');
            setCost('');
          }}
        />
      )}
      {budgetInput && leader && (
        <div className='budget-input-container'>
          <div className='budget-title'>
            <p>Distance (Km)</p>
            <p>Consumption (L)</p>
            <p>1 Litre Cost (Ft)</p>
          </div>
          <div className='budget-input'>
            <input type='text' placeholder='250' value={distance} onChange={(e) => setDistance(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} />
            <input type='text' placeholder='7' value={cons} onChange={(e) => setCons(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} />
            <input type='text' placeholder='450' value={cost} onChange={(e) => setCost(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} />
            <AiFillPlusCircle
              onClick={() => {
                addCast();
                setCalculate(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Travel;
