const axios = require('axios');

exports.pexelsApi = async (req, res) => {
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
    .catch((err) => console.log(err));
};
