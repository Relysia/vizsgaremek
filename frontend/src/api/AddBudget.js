import axios from 'axios';

const AddBudget = (type, GetBudget, setData, setBudgetInput, setFirst, setSecond, setThird, first, second, third) => {
  const jwt = localStorage.getItem('jwt');

  axios
    .post(`${process.env.REACT_APP_BACKEND_HOST}/api/budget/post`, { jwt, type, first, second, third })
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
