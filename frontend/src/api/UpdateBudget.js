import axios from 'axios';

const UpdateBudget = (type, GetBudget, setData, objectId, first, second, third) => {
  const jwt = localStorage.getItem('jwt');

  axios
    .post(`${process.env.REACT_APP_BACKEND_HOST}/api/budget/put`, { jwt, type, objectId, first, second, third })
    .then((res) => {
      GetBudget(setData, type);
    })
    .catch((err) => console.log(err));
};

export default UpdateBudget;
