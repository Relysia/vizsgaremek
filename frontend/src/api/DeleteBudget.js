import axios from 'axios';

const DeleteBudget = (type, GetBudget, setData, objectId) => {
  const jwt = localStorage.getItem('jwt');

  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/budget/delete`;

  const auth = { Authorization: jwt };

  const data = {
    type,
    objectId,
  };

  axios({ method: 'post', url, data, headers: auth })
    .then((res) => {
      GetBudget(setData, type);
    })
    .catch((err) => console.log(err));
};

export default DeleteBudget;
