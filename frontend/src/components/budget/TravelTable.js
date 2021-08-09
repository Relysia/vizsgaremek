import { useState, useRef, useEffect } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
import { AiFillSave } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';

function TravelTable({ data, updateCast, deleteCast, setCalculate, leader }) {
  const [newDistance, setNewDistance] = useState(data.travel_distance);
  const [newCons, setNewCons] = useState(data.travel_car_cons);
  const [newCost, setNewCost] = useState(data.travel_litre_cost);
  const [edit, setEdit] = useState(false);
  const selectInput = useRef(null);

  useEffect(() => {
    if (edit) {
      selectInput.current.focus();
    }
  }, [edit]);

  return (
    <div className='table-style travel-style'>
      <input type='text' onChange={(e) => setNewDistance(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} value={newDistance} ref={selectInput} readOnly={edit ? false : 'readonly'} />
      <input type='text' onChange={(e) => setNewCons(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} value={newCons} readOnly={edit ? false : 'readonly'} />
      <input type='text' onChange={(e) => setNewCost(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} value={newCost} readOnly={edit ? false : 'readonly'} />
      {!edit && leader ? (
        <AiTwotoneEdit onClick={() => setEdit(!edit)} />
      ) : (
        edit &&
        leader && (
          <AiFillSave
            onClick={() => {
              updateCast(data._id, newDistance, newCons, newCost);
              setEdit(!edit);
            }}
          />
        )
      )}
      {leader && (
        <BsTrashFill
          onClick={() => {
            deleteCast(data._id);
          }}
        />
      )}
    </div>
  );
}

export default TravelTable;
