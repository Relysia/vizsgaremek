import { useState, useRef, useEffect } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
import { AiFillSave } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';

function CastTable({ data, updateCast, deleteCast, leader }) {
  const [newRole, setNewRole] = useState(data.cast_role);
  const [newName, setNewName] = useState(data.cast_name);
  const [newCost, setNewCost] = useState(data.cast_cost);
  const [edit, setEdit] = useState(false);
  const selectInput = useRef(null);

  useEffect(() => {
    if (edit) {
      selectInput.current.focus();
    }
  }, [edit]);

  return (
    <div className='table-style'>
      <input type='text' onChange={(e) => setNewRole(e.target.value)} value={newRole} ref={selectInput} readOnly={edit ? false : 'readonly'} />
      <input type='text' onChange={(e) => setNewName(e.target.value)} value={newName} readOnly={edit ? false : 'readonly'} />
      <input type='text' onChange={(e) => setNewCost(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} value={newCost} readOnly={edit ? false : 'readonly'} />
      {!edit && leader ? (
        <AiTwotoneEdit onClick={() => setEdit(!edit)} />
      ) : (
        edit &&
        leader && (
          <AiFillSave
            onClick={() => {
              updateCast(data._id, newRole, newName, newCost);
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
