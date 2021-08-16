import { useContext } from 'react';
import { UserContext } from '../../App';
import { MenuContext } from '../../App';
import { Link, useHistory } from 'react-router-dom';
import { FaUserTie } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import { SiGooglecalendar } from 'react-icons/si';
import { CgMenuGridR } from 'react-icons/cg';
import { CgCloseR } from 'react-icons/cg';
import { FaCameraRetro } from 'react-icons/fa';

function Menu({ setMenuActive, playAnimation }) {
  const user = useContext(UserContext);
  const menu = useContext(MenuContext);
  const history = useHistory();

  function delayAndGo(e, to) {
    e.preventDefault();
    setTimeout(() => history.push(to), 1000);
  }

  return (
    <>
      {user && !user.firstTime && (
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
                    <Link
                      to='/crew'
                      onClick={(e) => {
                        delayAndGo(e, '/crew');
                        setMenuActive(false);
                        playAnimation();
                      }}>
                      <FaUserTie />
                      <h3>Crew</h3>
                    </Link>
                  </div>
                  <div>
                    <Link
                      to='/budget'
                      onClick={(e) => {
                        delayAndGo(e, '/budget');
                        setMenuActive(false);
                        playAnimation();
                      }}>
                      <GiCash />
                      <h3>Budget</h3>
                    </Link>
                  </div>
                  <div>
                    <Link
                      to='/events'
                      onClick={(e) => {
                        delayAndGo(e, '/events');
                        setMenuActive(false);
                        playAnimation();
                      }}>
                      <SiGooglecalendar />
                      <h3>Events</h3>
                    </Link>
                  </div>
                  <div>
                    <Link
                      to='/summary'
                      onClick={(e) => {
                        delayAndGo(e, '/summary');
                        setMenuActive(false);
                        playAnimation();
                      }}>
                      <FaCameraRetro />
                      <h3>Summary</h3>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Menu;
