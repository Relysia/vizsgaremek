import { useState, useRef, useEffect } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
import { AiFillSave } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';

function CastTable({ data, updateCast, deleteCast, leader }) {
  const [newDay, setNewDay] = useState(data.food_day);
  const [newCost, setNewCost] = useState(data.food_cost);
  const [edit, setEdit] = useState(false);
  const selectInput = useRef(null);

  useEffect(() => {
    if (edit) {
      selectInput.current.focus();
    }
  }, [edit]);

  return (
    <div className='table-style'>
      <input type='text' onChange={(e) => setNewDay(e.target.value)} value={newDay} ref={selectInput} readOnly={edit ? false : 'readonly'} />
      <input type='text' onChange={(e) => setNewCost(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} value={newCost} readOnly={edit ? false : 'readonly'} />
      {!edit && leader ? (
        <AiTwotoneEdit onClick={() => setEdit(!edit)} />
      ) : (
        edit &&
        leader && (
          <AiFillSave
            onClick={() => {
              const numberCost = parseInt(newCost);
              updateCast(data._id, newDay, numberCost);
              setEdit(!edit);
            }}
          />
        )
      )}
      {leader && <BsTrashFill onClick={() => deleteCast(data._id)} />}
    </div>
  );
}

export default CastTable;
