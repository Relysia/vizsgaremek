import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import Alert from '../alert/Alert';

function Login(props) {
  const search = useLocation().search;
  const code = new URLSearchParams(search).get('code');
  let history = useHistory();

  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .post('http://localhost:8080/api/login', { code })
      .then((res) => {
        localStorage.setItem('jwt', res.data);
        history.push('/');
        history.go(0);
      })
      .catch((err) => {
        setMessage(err.response.data);
        console.log(err.response.data);
      });
  }, [code, history]);

  return <div>{message ? <Alert alert={true} message={message} /> : <Alert alert={false} message={null} />}</div>;
}

export default Login;
