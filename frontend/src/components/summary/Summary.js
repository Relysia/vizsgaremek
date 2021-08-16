import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import PexelsPhotoApi from '../../api/PexelsPhotoApi';
import VideoBackground from '../utils/VideoBackground';
import axios from 'axios';
import Alert from '../alert/Alert';
import SumCrew from './SumCrew';
import SumBudget from './SumBudget';
import SumCalendar from './SumCalendar';

function Summary(props) {
  const menu = useContext(MenuContext);
  const [message, setMessage] = useState(null);
  const [bgVideo, setBgVideo] = useState(null);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);

  const getSummary = () => {
    const jwt = localStorage.getItem('jwt');

    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/summary`;

    const auth = { Authorization: jwt };

    axios({ method: 'post', url, headers: auth })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => setMessage(err.response.data));
  };

  useEffect(() => {
    PexelsVideoApi('4488706', setBgVideo);
    PexelsPhotoApi('4125673', setPhoto1, 'medium');
    PexelsPhotoApi('4488665', setPhoto2, 'medium');
    PexelsPhotoApi('7689080', setPhoto3, 'medium');
    getSummary();
  }, []);

  const formatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
  });

  const total = data && data.budget.total;
  const formatTotal = formatter.format(total);

  const dateArray = data && data.calendar.events?.map((event) => new Date(event.start.dateTime));
  const upcommingEventsNumber = data && dateArray && dateArray.filter((event) => event > new Date());

  return (
    <section>
      {!message ? (
        <>
          <VideoBackground video={bgVideo} />
          {!menu && (
            <div className='submenu-container'>
              <h2 className='submenu-title'>Summary</h2>
              <div className='summary-options'>
                {data && (
                  <>
                    <div className='summary-card' onClick={() => setActive('crew')}>
                      <h2>Crew</h2>
                      <div className='summary-photo'>{photo1 && <img src={photo1} alt='Cast' />}</div>
                      <div className='summary-details cast-card'>
                        <p>{`Your team has ${data.team.members.length + 1} Member`}</p>
                      </div>
                    </div>
                    <div className='summary-card' onClick={() => data.budget.total !== '' && setActive('budget')}>
                      <h2>Budget</h2>
                      <div className='summary-photo'>{photo2 && <img src={photo2} alt='Budget' />}</div>
                      <div className='summary-details budget-card'>
                        <p>{data.budget.total === '' ? 'Team budget is not public' : `Total cost: ${formatTotal}`}</p>
                      </div>
                    </div>
                    <div className='summary-card' onClick={() => data.calendar !== '' && setActive('calendar')}>
                      <h2>Calendar</h2>
                      <div className='summary-photo'>{photo3 && <img src={photo3} alt='Calendar' />}</div>
                      <div className='summary-details calendar-card'>
                        <p>{data.calendar === '' ? 'Calendar is not shared with you' : `You have ${upcommingEventsNumber.length} upcomming event`}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {active === 'crew' && <SumCrew data={data.team} setActive={setActive} />}
              {active === 'budget' && <SumBudget data={data.budget} setActive={setActive} formatter={formatter} />}
              {active === 'calendar' && <SumCalendar data={data.calendar} setActive={setActive} />}
            </div>
          )}
        </>
      ) : (
        <Alert alert={true} message={message} />
      )}
    </section>
  );
}

export default Summary;
