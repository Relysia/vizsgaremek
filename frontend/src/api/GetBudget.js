import axios from 'axios';

const GetBudget = (setData, type) => {
  const jwt = localStorage.getItem('jwt');

  axios
    .post(`${process.env.REACT_APP_BACKEND_HOST}/api/budget/get`, { jwt, type })
    .then((res) => {
      setData(res.data);
    })
    .catch((err) => console.log(err));
};

export default GetBudget;
