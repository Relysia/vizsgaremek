import { useContext } from 'react';
import { UserContext } from '../../App';
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { AiFillUnlock } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';
import Menu from './Menu';

function Navbar({ setUser, setMenuActive, playAnimation }) {
  const user = useContext(UserContext);
  const history = useHistory();

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
  };

  function delayAndGo(e, to) {
    e.preventDefault();
    setTimeout(() => history.push(to), 1000);
  }

  return (
    <nav>
      <Link
        to='/'
        onClick={(e) => {
          delayAndGo(e, '/');
          setMenuActive(false);
          playAnimation();
        }}>
        <h1 className='page-title'>Filmsquad</h1>
      </Link>

      {user ? (
        <>
          <div className='profile-container'>
            <img src={user.picture} alt='' />
            <h2>{user.name}</h2>
          </div>
          <div className='auth-container'>
            <Link
              to='/'
              onClick={(e) => {
                delayAndGo(e, '/');
                logout();
                playAnimation();
              }}>
              <AiOutlineLogout />
            </Link>
          </div>
          <Menu setMenuActive={setMenuActive} playAnimation={playAnimation} />
        </>
      ) : (
        <>
          <div className='auth-container'>
            <Link
              to='/googlereg'
              onClick={(e) => {
                delayAndGo(e, '/googlereg');
                playAnimation();
              }}>
              <AiOutlineUserAdd />
            </Link>
            <Link
              to='/googleauth'
              onClick={(e) => {
                delayAndGo(e, '/googleauth');
                playAnimation();
              }}>
              <AiFillUnlock />
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
