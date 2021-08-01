import { useState, useRef, useEffect } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
import { AiFillSave } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';

function CastTable({ data, updateCast, deleteCast }) {
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
    <div>
      <input type='text' onChange={(e) => setNewRole(e.target.value)} value={newRole} ref={selectInput} readOnly={edit ? false : 'readonly'} />
      <input type='text' onChange={(e) => setNewName(e.target.value)} value={newName} readOnly={edit ? false : 'readonly'} />
      <input type='text' onChange={(e) => setNewCost(e.target.value)} value={newCost} readOnly={edit ? false : 'readonly'} />
      <p>HUF</p>
      {!edit ? (
        <AiTwotoneEdit onClick={() => setEdit(!edit)} />
      ) : (
        <AiFillSave
          onClick={() => {
            updateCast(data._id, newRole, newName, newCost);
            setEdit(!edit);
          }}
        />
      )}
      <BsTrashFill onClick={() => deleteCast(data._id, data.cast_name)} />
    </div>
  );
}

export default CastTable;
