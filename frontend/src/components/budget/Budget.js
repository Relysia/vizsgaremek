import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import { HiUserGroup } from 'react-icons/hi';
import { GiFamilyHouse } from 'react-icons/gi';
import { AiFillCar } from 'react-icons/ai';
import { IoFastFoodSharp } from 'react-icons/io5';
import axios from 'axios';
import Alert from '../alert/Alert';
import Cast from './Cast';
import Rent from './Rent';
import Travel from './Travel';
import Food from './Food';

function Budget(props) {
  const menu = useContext(MenuContext);
  const [message, setMessage] = useState(null);
  const [bgVideo, setBgVideo] = useState(null);
  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);
  const [budgetRole, setBudgetRole] = useState(null);

  const getRoles = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/getroles`;

    const auth = { Authorization: jwt };

    axios({ method: 'post', url, headers: auth })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => setMessage(err.response.data));
  };

  const getBudgetRole = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/budget/role`;

    const auth = { Authorization: jwt };

    axios({ method: 'post', url, headers: auth })
      .then((res) => {
        setBudgetRole(res.data);
      })
      .catch((err) => setMessage(err.response.data));
  };

  useEffect(() => {
    PexelsVideoApi('3752547', setBgVideo);
    getRoles();
    getBudgetRole();
  }, []);

  return (
    <section>
      {!message ? (
        <>
          <VideoBackground video={bgVideo} />
          {!menu && (
            <div className='submenu-container'>
              {data && !active && data.calendar_id !== '' && budgetRole ? (
                <>
                  <h2 className='submenu-title'>Budget</h2>
                  <div className='submenu-options'>
                    <div onClick={() => setActive('cast')}>
                      <HiUserGroup />
                      <h3>Cast</h3>
                    </div>
                    <div onClick={() => setActive('rent')}>
                      <GiFamilyHouse />
                      <h3>Rent</h3>
                    </div>
                    <div onClick={() => setActive('travel')}>
                      <AiFillCar />
                      <h3>Travel</h3>
                    </div>
                    <div onClick={() => setActive('food')}>
                      <IoFastFoodSharp />
                      <h3>Food</h3>
                    </div>
                  </div>
                </>
              ) : !budgetRole ? (
                <p className='noteam-message'>Your team budget is not public!</p>
              ) : data && data.leader && data.calendar_id === '' ? (
                <p className='noteam-message'>You need to create a team first</p>
              ) : (
                data && !data.leader && data.calendar_id === '' && <p className='noteam-message'>You need to join a team first!</p>
              )}
              {active === 'cast' && <Cast leader={data.leader} setActive={setActive} />}
              {active === 'rent' && <Rent leader={data.leader} setActive={setActive} />}
              {active === 'travel' && <Travel leader={data.leader} setActive={setActive} />}
              {active === 'food' && <Food leader={data.leader} setActive={setActive} />}
            </div>
          )}
        </>
      ) : (
        <Alert alert={true} message={message} />
      )}
    </section>
  );
}

export default Budget;
