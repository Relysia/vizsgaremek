import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

function SumBudget({ data, setActive, formatter }) {
  return (
    <div className='summary-submenu'>
      <AiFillCloseCircle onClick={() => setActive(false)} />
      <h3>Budget</h3>
      <div className='summary-budget'>
        <div>
          <h4>Cast</h4>
          <p>{formatter.format(data.budget.cast_total)}</p>
        </div>
        <div>
          <h4>Rent</h4>
          <p>{formatter.format(data.budget.rent_total)}</p>
        </div>
        <div>
          <h4>Travel</h4>
          <p>{formatter.format(data.budget.travel_total)}</p>
        </div>
        <div>
          <h4>Food</h4>
          <p>{formatter.format(data.budget.food_total)}</p>
        </div>
      </div>
      <h4 className='summary-budget-total'>Total</h4>
      <p className='summary-budget-price'>{formatter.format(data.total)}</p>
    </div>
  );
}

export default SumBudget;
