import axios from 'axios';

const GetBudget = (setData, type) => {
  const jwt = localStorage.getItem('jwt');

  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/budget/get`;

  const auth = { Authorization: jwt };

  const data = {
    type,
  };

  axios({ method: 'post', url, data, headers: auth })
    .then((res) => {
      setData(res.data);
    })
    .catch((err) => console.log(err));
};

export default GetBudget;
