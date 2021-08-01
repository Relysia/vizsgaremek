const User = require('../models/user');
const jwt_decode = require('jwt-decode');

exports.updateBudget = async (req, res) => {
  const { jwt, type, objectId, first, second, third } = req.query;
  const { google_id } = jwt_decode(jwt);

  await User.findOne({ google_id })
    .then((doc) => {
      item = doc.budget.cast.filter((cast) => cast._id.toString() === objectId.toString());
      if (first !== '') {
        item[0].cast_role = first;
      }
      if (second !== '') {
        item[0].cast_name = second;
      }
      if (third !== '') {
        item[0].cast_cost = third;
      }
      doc.save();
      console.log('Successfully updated cast details!');
    })
    .catch((err) => {
      console.log('Oh! Dark');
    });

  res.send('Hello');
};
