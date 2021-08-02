import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import VideoBackground from '../utils/VideoBackground';
import { HiUserGroup } from 'react-icons/hi';
import { GiFamilyHouse } from 'react-icons/gi';
import { GiCommercialAirplane } from 'react-icons/gi';
import { IoFastFoodSharp } from 'react-icons/io5';
import Cast from './Cast';
import Rent from './Rent';
import Travel from './Travel';
import Food from './Food';

function Budget(props) {
  const menu = useContext(MenuContext);
  const [bgVideo, setBgVideo] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    PexelsVideoApi('3752547', setBgVideo);
  }, []);

  return (
    <div>
      <VideoBackground video={bgVideo} />
      {!menu && (
        <div className={active ? 'budget-container-active' : 'budget-container'}>
          {!active && (
            <>
              <h2>Budget</h2>
              <div className='budget-options'>
                <div onClick={() => setActive('cast')}>
                  <HiUserGroup />
                  <h3>Cast</h3>
                </div>
                <div onClick={() => setActive('rent')}>
                  <GiFamilyHouse />
                  <h3>Rent</h3>
                </div>
                <div onClick={() => setActive('travel')}>
                  <GiCommercialAirplane />
                  <h3>Travel</h3>
                </div>
                <div onClick={() => setActive('food')}>
                  <IoFastFoodSharp />
                  <h3>Food</h3>
                </div>
              </div>
            </>
          )}
          {active === 'cast' && <Cast setActive={setActive} />}
          {active === 'rent' && <Rent setActive={setActive} />}
          {active === 'travel' && <Travel setActive={setActive} />}
          {active === 'food' && <Food setActive={setActive} />}
        </div>
      )}
    </div>
  );
}

export default Budget;
