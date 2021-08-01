import { useContext } from 'react';
import { MenuContext } from '../../App';
import { Link } from 'react-router-dom';
import { FaUserTie } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import { SiGooglecalendar } from 'react-icons/si';
import { CgMenuGridR } from 'react-icons/cg';
import { CgCloseR } from 'react-icons/cg';
import { FaCameraRetro } from 'react-icons/fa';

function Menu({ setMenuActive }) {
  const menu = useContext(MenuContext);

  return (
    <div>
      {!menu ? (
        <>
          <CgMenuGridR className='menu-button' onClick={() => setMenuActive(true)} />
        </>
      ) : (
        <>
          <CgCloseR className='menu-button' onClick={() => setMenuActive(false)} />
          <div className='menu-container'>
            <div className='menu-options'>
              <div>
                <FaUserTie />
                <h3>Crew</h3>
              </div>
              <div>
                <Link to='/budget' onClick={() => setMenuActive(false)}>
                  <GiCash />
                  <h3>Budget</h3>
                </Link>
              </div>
              <div>
                <SiGooglecalendar />
                <h3>Events</h3>
              </div>
              <div>
                <FaCameraRetro />
                <h3>Summary</h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Menu;
