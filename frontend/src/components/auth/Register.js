import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import Alert from '../alert/Alert';

function Register(props) {
  const search = useLocation().search;
  const code = new URLSearchParams(search).get('code');
  let history = useHistory();

  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_HOST}/api/register`, { code })
      .then((res) => {
        setMessage(res.data);
      })
      .catch((err) => {
        setMessage(err.response.data);
        console.log(err.response.data);
      });
  }, [code, history]);

  return <div>{message ? <Alert alert={true} message={message} /> : <Alert alert={false} message={null} />}</div>;
}

export default Register;
