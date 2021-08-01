const User = require('../models/user');

exports.confirm = async (req, res) => {
  const user = await User.findOne({ email: req.query.email });

  if (user?.uniqueString === req.query.code && user?.email === req.query.email) {
    user.isValid = true;
    await User.updateOne({ email: req.query.email }, { $unset: { uniqueString: '' } });
    await user.save();
    return res.send('Email successfully confirmed!');
  }

  return res.status(400).send('Invalid confirmation link!');
};
