const User = require('../../models/user');

exports.confirm = async (req, res) => {
  const { code, email } = req.body;

  console.log({ code, email });

  const user = await User.findOne({ email });

  if (user?.uniqueString === code && user?.email === email) {
    user.isValid = true;
    await User.updateOne({ email }, { $unset: { uniqueString: '' } });
    await user.save();
    return res.send('Email successfully confirmed!');
  }

  return res.status(400).send('Invalid confirmation link!');
};
