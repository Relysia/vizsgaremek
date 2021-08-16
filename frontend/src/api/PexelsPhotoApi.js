import axios from 'axios';
import fallbackImage from '../assets/fallbackImage.jpg';

const PexelsPhotoApi = (photoId, setPhoto, size) => {
  const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pexelsphoto`;

  const data = {
    photoId,
  };

  axios({ method: 'post', url, data })
    .then((res) => {
      setPhoto(res.data.src[size]);
    })
    .catch((err) => {
      setPhoto(fallbackImage);
    });
};

export default PexelsPhotoApi;
