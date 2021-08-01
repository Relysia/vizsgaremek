const User = require('../models/user');
const jwt_decode = require('jwt-decode');
const mongoose = require('mongoose');

exports.deleteBudget = async (req, res) => {
  const { jwt, type, objectId, name } = req.query;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  // if (!user) {
  //   res.status(400).send('User not found!');
  // }

  // console.log(name);

  if (type === 'cast') {
    await User.findOne({ google_id })
      .then((doc) => {
        doc.budget.cast.filter((cast) => cast._id.toString() !== objectId.toString()).pull({ _id: objectId });
        doc.save();
        console.log('Successfully updated cast details!');
      })
      .catch((err) => {
        console.log('Oh! Dark');
      });

    user.save();
  }

  res.send('HEllo');
};
