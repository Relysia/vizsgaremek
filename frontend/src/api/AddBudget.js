import axios from 'axios';

const AddBudget = (type, GetBudget, setData, setBudgetInput, setFirst, setSecond, setThird, first, second, third) => {
  const jwt = localStorage.getItem('jwt');

  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/budget/post`;

  const auth = { Authorization: jwt };

  const data = {
    type,
    first,
    second,
    third,
  };

  axios({ method: 'post', url, data, headers: auth })
    .then((res) => {
      GetBudget(setData, type);
      setBudgetInput(false);
      if (setFirst !== 'first') {
        setFirst('');
      }
      setSecond('');
      setThird('');
    })
    .catch((err) => console.log(err));
};

export default AddBudget;
