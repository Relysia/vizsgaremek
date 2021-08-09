import axios from 'axios';

const UpdateBudget = (type, GetBudget, setData, objectId, first, second, third) => {
  const jwt = localStorage.getItem('jwt');

  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/budget/put`;

  const auth = { Authorization: jwt };

  const data = {
    type,
    objectId,
    first,
    second,
    third,
  };

  axios({ method: 'post', url, data, headers: auth })
    .then((res) => {
      GetBudget(setData, type);
    })
    .catch((err) => console.log(err));
};

export default UpdateBudget;
