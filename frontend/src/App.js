import { useState, createContext, useEffect } from 'react';
import './sass/App.sass';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Landing from './components/main/Landing';
import Home from './components/main/Home';
import RoleSelect from './components/main/RoleSelect';
import Navbar from './components/main/Navbar';
import Confirm from './components/auth/Confirm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Budget from './components/budget/Budget';
import Crew from './components/team/Crew';
import Events from './components/calendar/Events';

export const UserContext = createContext(null);
export const MenuContext = createContext(false);
export const AnimationContext = createContext(false);

function App() {
  const [user, setUser] = useState(null);
  const [menuActive, setMenuActive] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);

  const googleRegUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&prompt=select_account&client_id=564539410202-g7nt7tife84vsvi5ht3aokddd01a1f6n.apps.googleusercontent.com&scope=openid%20profile%20email&redirect_uri=${process.env.REACT_APP_FRONTEND_HOST}/register`;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&prompt=select_account&client_id=564539410202-g7nt7tife84vsvi5ht3aokddd01a1f6n.apps.googleusercontent.com&scope=openid%20profile%20email%20https://www.googleapis.com/auth/calendar&redirect_uri=${process.env.REACT_APP_FRONTEND_HOST}/login`;

  const assignToken = async () => {
    let jwt = localStorage.getItem('jwt');
    if (jwt) {
      let token = await jwt_decode(jwt);
      if (token.exp < Date.now() / 1000) {
        setUser(null);
        localStorage.removeItem('jwt');
      } else {
        setUser(token);
      }
    }
  };

  const playAnimation = () => {
    setAnimationActive(true);
    setTimeout(() => {
      setAnimationActive(false);
    }, 2000);
  };

  useEffect(() => {
    assignToken();
    playAnimation();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={user}>
        <MenuContext.Provider value={menuActive}>
          <AnimationContext.Provider value={menuActive}>
            <Navbar setUser={setUser} setMenuActive={setMenuActive} playAnimation={playAnimation} />
            <div className='top-bar'></div>
            <div className='bot-bar'></div>
            {animationActive && (
              <>
                <div className='fade-animation'></div>
              </>
            )}
            <Switch>
              {user && !user.firstTime ? (
                <>
                  <Route path='/' exact component={Home}></Route>
                  <Route path='/budget' exact component={Budget}></Route>
                  <Route path='/crew' exact component={Crew}></Route>
                  <Route path='/events' exact component={Events}></Route>
                  <Route
                    path='/gasprice'
                    component={() => {
                      window.location.href = 'https://holtankoljak.hu/';
                      return null;
                    }}></Route>
                </>
              ) : user && user.firstTime ? (
                <>
                  <Route path='/' exact component={RoleSelect}></Route>
                </>
              ) : (
                <>
                  <Route path='/' exact component={Landing}></Route>
                  <Route
                    path='/googlereg'
                    component={() => {
                      window.location.href = googleRegUrl;
                      return null;
                    }}></Route>
                  <Route
                    path='/googleauth'
                    component={() => {
                      window.location.href = googleAuthUrl;
                      return null;
                    }}></Route>
                  <Route path='/login' component={Login}></Route>
                  <Route path='/register' component={Register}></Route>
                  <Route path='/confirm' component={Confirm}></Route>
                </>
              )}
            </Switch>
          </AnimationContext.Provider>
        </MenuContext.Provider>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
