import axios from 'axios';
import fallbackVideo from '../assets/fallbackVideo.mp4';

const PexelsVideoApi = (videoId, setVideo) => {
  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pexelsvideo`;

  const data = {
    videoId,
  };

  axios({ method: 'post', url, data })
    .then((res) => {
      setVideo(res.data);
    })
    .catch((err) => setVideo(fallbackVideo));
};

export default PexelsVideoApi;
