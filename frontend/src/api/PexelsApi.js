import axios from 'axios';

const PexelsVideoApi = (videoId, setVideo) => {
  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pexelsvideo`;

  const data = {
    videoId,
  };

  axios({ method: 'post', url, data })
    .then((res) => {
      setVideo(res.data);
    })
    .catch((err) => console.log(err));
};

export default PexelsVideoApi;
