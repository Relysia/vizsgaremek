import axios from 'axios';

const DeleteBudget = (type, GetBudget, setData, objectId) => {
  const jwt = localStorage.getItem('jwt');

  axios
    .post(`${process.env.REACT_APP_BACKEND_HOST}/api/budget/delete`, { jwt, type, objectId })
    .then((res) => {
      GetBudget(setData, type);
    })
    .catch((err) => console.log(err));
};

export default DeleteBudget;
