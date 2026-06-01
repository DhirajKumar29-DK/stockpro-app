const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'ad1b2c001@smtp-brevo.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"StockPro" <dhirajroydj69@gmail.com>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;