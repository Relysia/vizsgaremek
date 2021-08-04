const sgMail = require('@sendgrid/mail');
const jade = require('jade');
const path = require('path');

const sendgrid = (name, uniqueString, email, subject, template) => {
  sgMail.setApiKey(process.env.SENDGRID_API);

  const frontendUrl = process.env.FRONTEND_HOST;

  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    subject,
    html: jade.renderFile(path.join(__dirname, `../views/${template}.jade`), { frontendUrl, name, uniqueString, email }),
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports.sendgrid = sendgrid;
