import { useContext, useEffect, useState } from 'react';
import { MenuContext } from '../../App';
import PexelsVideoApi from '../../api/PexelsApi';
import PexelsPhotoApi from '../../api/PexelsPhotoApi';
import VideoBackground from '../utils/VideoBackground';
import axios from 'axios';
import Alert from '../alert/Alert';

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
        console.log(res.data);
      })
      .catch((err) => setMessage(err.response.data));
  };

  useEffect(() => {
    PexelsVideoApi('5928009', setBgVideo);
    PexelsPhotoApi('5642756', setPhoto1, 'medium');
    PexelsPhotoApi('259165', setPhoto2, 'medium');
    PexelsPhotoApi('5417678', setPhoto3, 'medium');
    getSummary();
  }, []);

  const formatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
  });
  const total = data && data.budget.total;
  const formatTotal = formatter.format(total);

  const dateArray = data && data.calendar.events.map((event) => new Date(event.start.dateTime));
  const upcommingEventsNumber = data && dateArray.filter((event) => event > new Date());

  return (
    <div className='no-overflow'>
      {!message ? (
        <>
          <VideoBackground video={bgVideo} />
          {!menu && (
            <div className='submenu-container'>
              {!active && (
                <>
                  <h2 className='submenu-title'>Summary</h2>
                  <div className='summary-options'>
                    {data && (
                      <>
                        <div className='summary-card'>
                          <div className='summary-photo'>{photo1 && <img src={photo1} alt='Cast' />}</div>
                          <h2>Crew</h2>
                          <div className='summary-details cast-card'>
                            <p>{data.team.members.length < 1 ? 'Your team has no member' : `Your team has ${data.team.members.length.toString()} Member`}</p>
                          </div>
                        </div>
                        <div className='summary-card'>
                          <div className='summary-photo'>{photo2 && <img src={photo2} alt='Budget' />}</div>
                          <h2>Budget</h2>
                          <div className='summary-details budget-card'>
                            <p>{data.budget.total.length < 1 ? 'Team budget is not public' : `Total cost: ${formatTotal}`}</p>
                          </div>
                        </div>
                        <div className='summary-card'>
                          <div className='summary-photo'>{photo3 && <img src={photo3} alt='Calendar' />}</div>
                          <h2>Calendar</h2>
                          <div className='summary-details calendar-card'>
                            <p>{data.calendar.length < 1 ? 'Calendar is not shared with you' : `You have ${upcommingEventsNumber.length} upcomming event`}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <Alert alert={true} message={message} />
      )}
    </div>
  );
}

export default Summary;
