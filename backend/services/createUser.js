const jwt_decode = require('jwt-decode');
const crypto = require('crypto');
const User = require('../models/user');
const { sendgrid } = require('./sendgrid');

exports.createUser = async (data, res) => {
  const { sub, name, email, picture } = jwt_decode(data.id_token);

  // Check if user already exist
  const user_id = await User.findOne({ google_id: sub });

  if (user_id) {
    return res.status(403).send('You already registered with this email!');
  }

  const uniqueString = crypto.randomBytes(5).toString('hex');

  // Sending confirmation email
  let emailSubject = 'FilmSquad confirmation email';
  let emailTemplate = 'confirm';
  sendgrid(name, uniqueString, email, emailSubject, emailTemplate);

  const newUser = new User({
    google_id: sub,
    name,
    email,
    picture,
    uniqueString,
  });

  await newUser.save();

  return res.status(200).send(`Confirmation link has been sent to your email: ${email}`);
};
