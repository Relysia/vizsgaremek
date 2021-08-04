const Budget = require('../../models/budget');
const jwt_decode = require('jwt-decode');

exports.deleteBudget = async (req, res) => {
  const { jwt, type, objectId } = req.body;
  const { google_id } = jwt_decode(jwt);
  const budget = await Budget.findOne({ google_id });

  budget[type].pull({ _id: objectId });

  await budget.save();

  res.status(200).send('Successfully deleted cast member!');
};
