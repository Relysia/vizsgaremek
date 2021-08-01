import axios from 'axios';

const PexelsVideoApi = (videoId, setVideo) => {
  const url = `https://api.pexels.com/videos/videos/${videoId}`;

  const headers = {
    headers: {
      Authorization: process.env.REACT_APP_PEXEL_API_KEY,
    },
  };

  axios
    .get(url, headers)
    .then((res) => {
      setVideo(res.data.video_files[3].link);
    })
    .catch((err) => console.log(err));
};

export default PexelsVideoApi;
