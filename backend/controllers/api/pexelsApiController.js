const axios = require('axios');

exports.pexelsVideoApi = async (req, res) => {
  const { videoId } = req.body;

  const url = `https://api.pexels.com/videos/videos/${videoId}`;

  const headers = {
    headers: {
      Authorization: process.env.PEXEL_API_KEY,
    },
  };

  axios
    .get(url, headers)
    .then((response) => {
      res.send(response.data.video_files[3].link);
    })
    .catch((err) => res.status(400).send('Error getting pexels video!'));
};

exports.pexelsPhotoApi = async (req, res) => {
  const { photoId } = req.body;

  const url = `https://api.pexels.com/v1/photos/${photoId}`;

  const headers = {
    headers: {
      Authorization: process.env.PEXEL_API_KEY,
    },
  };

  axios
    .get(url, headers)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => res.status(400).send('Error getting pexels photo!'));
};
