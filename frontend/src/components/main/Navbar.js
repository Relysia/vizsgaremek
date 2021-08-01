import { useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { AiFillUnlock } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';
import Menu from './Menu';

function Navbar({ setUser, setMenuActive }) {
  const user = useContext(UserContext);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
  };

  return (
    <nav>
      <Link to='/' onClick={() => setMenuActive(false)}>
        <h1 className='page-title'>Filmsquad</h1>
      </Link>
      {user ? (
        <>
          <div className='profile-container'>
            <img src={user.picture} alt='' />
            <h2>{user.name}</h2>
          </div>
          <div className='auth-container'>
            <Link to='/' onClick={logout}>
              <AiOutlineLogout />
            </Link>
          </div>
          <Menu setMenuActive={setMenuActive} />
        </>
      ) : (
        <>
          <div className='auth-container'>
            <Link to='/googlereg'>
              <AiOutlineUserAdd />
            </Link>
            <Link to='/googleauth'>
              <AiFillUnlock />
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
