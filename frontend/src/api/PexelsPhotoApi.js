import axios from 'axios';

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
      console.log(err);
    });
};

export default PexelsPhotoApi;
